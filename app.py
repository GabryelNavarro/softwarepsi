from flask import Flask, request, jsonify
from supabase import create_client, Client
from flask_cors import CORS

app = Flask(__name__)

# 🔓 Libera CORS para qualquer origem (bom para desenvolvimento)
CORS(app, resources={r"/*": {"origins": "*"}})

# 🔑 Configurações do Supabase
SUPABASE_URL = "https://kzuhalnyldsqaoxjyrkh.supabase.co"
SUPABASE_API = "sb_secret_Fd_wygXtB1flTm2QhQb3bg_U3BnBWAC"

# 📡 Criar conexão com Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_API)

# ➕ Rota para adicionar paciente
@app.route('/paciente', methods=['POST'])
def adicionar_paciente():
    data = request.get_json()
    print("📥 JSON recebido:", data)  # Debug no terminal

    # Validação básica
    if not data or "nome_paciente" not in data:
        return jsonify({"erro": "JSON inválido ou campo 'nome_paciente' ausente"}), 400

    novo_paciente = {
    "nome_paciente": data.get("nome_paciente"),
    "data_atendimento": data.get("data_atendimento"),  # formato: "YYYY-MM-DD"
    "tempo_atendimento": data.get("tempo_atendimento"),
    "idade_paciente": data.get("idade_paciente"),
    "cid_paciente": data.get("cid_paciente"),
    "palno_cov": data.get("palno_cov"),  # <-- ADICIONADO
    "valor_paciente": data.get("valor_paciente")
}
    resposta = supabase.table("paciente").insert(novo_paciente).execute()

    if resposta.data:
        return jsonify({"mensagem": "Paciente adicionado com sucesso!"}), 201
    else:
        return jsonify({"erro": "Falha ao adicionar paciente"}), 400

# 📋 Rota para listar pacientes
@app.route('/paciente', methods=['GET'])
def listar_pacientes():
    resposta = supabase.table("paciente").select("*").execute()
    return jsonify(resposta.data), 200

if __name__ == '__main__':
    # 🚀 Rodar na porta 5000 (React fica na 3000)
    app.run(debug=True, port=5000)