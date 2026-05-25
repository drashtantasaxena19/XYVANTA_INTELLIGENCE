from functools import lru_cache


MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model():
    from sentence_transformers import SentenceTransformer

    return SentenceTransformer(MODEL_NAME)


def semantic_similarity(text_a: str, text_b: str) -> float:
    if not text_a or not text_b:
        return 0.0

    try:
        from sklearn.metrics.pairwise import cosine_similarity

        model = get_embedding_model()

        embeddings = model.encode(
            [text_a, text_b],
            normalize_embeddings=True,
        )

        score = cosine_similarity(
            [embeddings[0]],
            [embeddings[1]],
        )[0][0]

        return float(score)

    except Exception as error:
        print(f"⚠️ Embedding similarity failed: {error}")
        return 0.0