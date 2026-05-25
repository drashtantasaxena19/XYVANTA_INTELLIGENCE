VALID_COMPARISON_MODES = {
    "single_jd_multiple_cv",
    "multiple_jd_single_cv",
    "multiple_jd_multiple_cv",
}


def ranking_score(
    item: dict,
) -> float:

    final_score = item.get(
        "final_score",
        0,
    )

    join_probability = (
        item.get(
            "join_probability",
            {},
        ).get(
            "percentage",
            0,
        )
    )

    role_score = (
        item.get(
            "score_breakdown",
            {},
        ).get(
            "role",
            {},
        ).get(
            "percentage",
            0,
        )
    )

    experience_score = (
        item.get(
            "score_breakdown",
            {},
        ).get(
            "experience",
            {},
        ).get(
            "percentage",
            0,
        )
    )

    return round(
        (
            final_score * 0.60
            + join_probability * 0.20
            + role_score * 0.10
            + experience_score * 0.10
        ),
        2,
    )


def get_ranked_candidates(
    matrix: list[dict],
) -> list[dict]:

    best_by_resume = {}

    for item in matrix:

        resume_id = item["resume_id"]

        current_rank_score = ranking_score(
            item
        )

        existing = best_by_resume.get(
            resume_id
        )

        if (
            existing is None
            or current_rank_score
            > ranking_score(existing)
        ):
            best_by_resume[
                resume_id
            ] = item

    ranked = sorted(
        best_by_resume.values(),
        key=lambda item: ranking_score(item),
        reverse=True,
    )

    return ranked


def get_ranked_jobs(
    matrix: list[dict],
) -> list[dict]:

    best_by_jd = {}

    for item in matrix:

        jd_id = item["jd_id"]

        current_rank_score = ranking_score(
            item
        )

        existing = best_by_jd.get(
            jd_id
        )

        if (
            existing is None
            or current_rank_score
            > ranking_score(existing)
        ):
            best_by_jd[jd_id] = item

    ranked = sorted(
        best_by_jd.values(),
        key=lambda item: ranking_score(item),
        reverse=True,
    )

    return ranked


def validate_comparison_mode(
    comparison_mode: str,
    jd_count: int,
    resume_count: int,
) -> str:

    mode = comparison_mode.strip().lower()

    if mode not in VALID_COMPARISON_MODES:
        raise ValueError(
            "Invalid comparison mode."
        )

    if (
        mode == "single_jd_multiple_cv"
        and jd_count != 1
    ):
        raise ValueError(
            "One_JD to Many_CV requires exactly 1 JD."
        )

    if (
        mode == "multiple_jd_single_cv"
        and resume_count != 1
    ):
        raise ValueError(
            "Many_JD to One_CV requires exactly 1 resume."
        )

    return mode