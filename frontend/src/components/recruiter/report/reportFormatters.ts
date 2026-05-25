function cleanText(value: any): string {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    return String(value).trim();
}

function labelize(key: string): string {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatObject(item: any): string {
    if (!item || typeof item !== "object") {
        return cleanText(item);
    }

    const projectText = [
        item.name || item.project_name || item.title,
        Array.isArray(item.technologies)
            ? item.technologies.join(", ")
            : item.technologies,
        item.description,
    ]
        .filter(Boolean)
        .join(" — ");

    if (projectText) return projectText;

    const educationText = [
        item.degree,
        item.field_of_study || item.field,
        item.institution || item.college || item.university,
        item.graduation_year || item.year,
    ]
        .filter(Boolean)
        .join(" — ");

    if (educationText) return educationText;

    const languageText = [
        item.language || item.name,
        item.proficiency || item.level,
    ]
        .filter(Boolean)
        .join(" — ");

    if (languageText) return languageText;

    const experienceText = [
        item.role || item.position || item.title,
        item.company || item.organization,
        item.duration || item.years || item.period,
    ]
        .filter(Boolean)
        .join(" — ");

    if (experienceText) return experienceText;

    const readable = Object.entries(item)
        .filter(([, value]) => value !== null && value !== undefined && value !== "")
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${labelize(key)}: ${value.map(formatValue).join(", ")}`;
            }

            if (typeof value === "object") {
                return `${labelize(key)}: ${formatObject(value)}`;
            }

            if (typeof value === "boolean") {
                return `${labelize(key)}: ${value ? "Yes" : "No"}`;
            }

            return `${labelize(key)}: ${String(value)}`;
        })
        .join(" | ");

    return readable || "Not detected";
}

export function formatValue(value: any): string {
    if (value === null || value === undefined || value === "") {
        return "Not detected";
    }

    if (Array.isArray(value)) {
        if (value.length === 0) return "Not detected";

        return value
            .map((item) => {
                if (typeof item === "object" && item !== null) {
                    return formatObject(item);
                }

                return cleanText(item);
            })
            .filter(Boolean)
            .join(", ");
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return formatObject(value);
    }

    return cleanText(value) || "Not detected";
}

export function formatScore(value: any): number {
    const score = Number(value);

    if (Number.isNaN(score)) return 0;

    return Math.max(0, Math.min(100, Math.round(score)));
}

export function formatLabel(value: string): string {
    return labelize(value);
}

export function getStatusTone(status?: string, appliedToScore?: boolean) {
    if (appliedToScore === false) {
        return {
            wrapper: "border-slate-200 bg-slate-50 text-slate-600",
            label: "Neutral",
        };
    }

    if (status === "matched" || status === "available") {
        return {
            wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
            label: status,
        };
    }

    if (status === "weak") {
        return {
            wrapper: "border-amber-200 bg-amber-50 text-amber-700",
            label: status,
        };
    }

    return {
        wrapper: "border-slate-200 bg-slate-50 text-slate-600",
        label: status || "Not detected",
    };
}