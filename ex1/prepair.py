import json

def preparar_dataset_unico(ficheiro_entrada, ficheiro_saida):
    try:
        with open(ficheiro_entrada, 'r', encoding='utf-8') as f:
            dados = json.load(f)
    except FileNotFoundError:
        print(f"Erro: O ficheiro '{ficheiro_entrada}' não foi encontrado.")
        return

    lista_reparacoes = dados.get("reparacoes", [])

    if lista_reparacoes:
        with open(ficheiro_saida, 'w', encoding='utf-8') as f:
            json.dump(lista_reparacoes, f, ensure_ascii=False, indent=2)
        print(f"Sucesso! Ficheiro '{ficheiro_saida}' gerado com {len(lista_reparacoes)} documentos prontos a importar.")
    else:
        print("Erro: Não foram encontradas reparações no ficheiro.")


ficheiro_origem = 'dataset_reparacoes.json' 
ficheiro_destino = 'dataset_pronto.json'

preparar_dataset_unico(ficheiro_origem, ficheiro_destino)