from flask import Flask, jsonify
from flask_cors import CORS
from app.routes.login import login_bp
from app.routes.clientes import clientes_bp
from app.routes.tecnicos import tecnicos_bp
from app.routes.servicios import servicios_bp

app = Flask(__name__)

# Permitir peticiones desde cualquier origen a todas las rutas de la API
CORS(app, resources={r"/*": {"origins": "*"}})

app.register_blueprint(login_bp)
app.register_blueprint(clientes_bp)
app.register_blueprint(tecnicos_bp)
app.register_blueprint(servicios_bp)

@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "API Servicios Tecnicos funcionando"
    })

if __name__ == "__main__":
    app.run(debug=True)