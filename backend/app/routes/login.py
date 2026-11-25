from flask import Blueprint, request, jsonify
from app.config.conexion import conectar

login_bp = Blueprint('login_bp', __name__)

@login_bp.route("/api/login", methods=["POST"])
def login():
    datos = request.get_json(silent=True) or {}
    
    # 1. Obtenemos usuario y contraseña sin importar cómo vengan los nombres desde React
    usuario = datos.get("username") or datos.get("usuario")
    password = datos.get("password") or datos.get("contrasena")

    if not usuario or not password:
        return jsonify({"success": False, "message": "Datos incompletos"}), 400

    conexion = conectar()
    if conexion is None:
        return jsonify({"success": False, "message": "Error de conexión a la BD"}), 500

    cursor = None
    try:
        cursor = conexion.cursor(dictionary=True)
        
        # 2. Buscamos contra las columnas 'username' y 'password' de tu tabla en MySQL
        cursor.execute(
            "SELECT * FROM usuario WHERE username = %s AND password = %s",
            (str(usuario).strip(), str(password).strip())
        )
        usuario_encontrado = cursor.fetchone()

        if usuario_encontrado:
            return jsonify({
                "success": True, 
                "message": "Login exitoso",
                "usuario": usuario_encontrado["username"]
            }), 200
        else:
            return jsonify({
                "success": False, 
                "message": "Usuario o contraseña incorrectos"
            }), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    finally:
        if cursor: cursor.close()
        conexion.close()