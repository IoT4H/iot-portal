import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";

export function mapUseCase(
    useCase: any,
    keyWordMap: Map<string, string> = new Map<string, string>()
): UseCase {
    let description: any = useCase.attributes.description;
    let summary: any = [
        { type: "paragraph", children: [{ type: "text", text: useCase.attributes.summary || "" }] }
    ];

    const masterRegexString =
        "\\b(?<!\\[)(" +
        Array.from(keyWordMap.keys())
            .sort((a, b) => b.length - a.length)
            .map((key) => key)
            .join("|") +
        ")(\\w{0,2})(?!\\]|-)\\b";
    const masterRegex = new RegExp(masterRegexString, "gm");

    const replacer = (
        match: string,
        group1: string,
        group2: string | undefined,
        offset: number,
        input: string
    ) => {
        return keyWordMap.get(group1)?.replace(group1, match) || match;
    };

    if (keyWordMap.size > 0) {
        if (description != undefined) {
            description = JSON.parse(JSON.stringify(description).replaceAll(masterRegex, replacer));

        }

        if (useCase.attributes.summary != undefined) {
            summary = JSON.parse(JSON.stringify(summary).replaceAll(masterRegex, replacer));

        }
    }

    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail:
            (useCase.attributes.thumbnail &&
                useCase.attributes.thumbnail.data &&
                useCase.attributes.thumbnail.data.attributes &&
                useCase.attributes.thumbnail.data.attributes.url &&
                useCase.attributes.thumbnail.data.attributes) ||
            undefined,
        summary: summary,
        description: description || [],
        pictures:
            (useCase.attributes.pictures &&
                useCase.attributes.pictures.data &&
                useCase.attributes.pictures.data.map((b: any) => b.attributes)) ||
            [],
        tags:
            (useCase.attributes.tags &&
                useCase.attributes.tags.data.map((t: any) => t.attributes.name)) ||
            [],
        devices:
            (useCase.attributes.Images &&
                useCase.attributes.Images.filter((i: any) => i.device.data !== null)) ||
            [],
        setupDuration: useCase.attributes.setupDuration,
        complexity: useCase.attributes.complexity,
        instructions: useCase.attributes.instructions,
        costs: useCase.attributes.costs,
        firms:
            (useCase.attributes.firms &&
                useCase.attributes.firms.data.map((f: any) => f.attributes)) ||
            [],
        partnerLogos:
            (useCase.attributes.partnerLogos &&
                useCase.attributes.partnerLogos.data &&
                useCase.attributes.partnerLogos.data.map((b: any) => b.attributes)) ||
            [],
        setupSteps: useCase.attributes.setupSteps || []
    };
}

export function generateSlugToLinkMap(slugData: any): Map<string, string> {
    const slugToLink = new Map<string, string>();
    if (slugData.data) {
        for (const entry of slugData.data) {
            const keyWords = entry.attributes.keyWords;
            if (Array.isArray(keyWords)) {
                for (const key of keyWords) {
                    const slugLink = `" }, { "type": "link", "url": "/api/wissen/${entry.attributes.slug}", "children": [ { "type": "text", "text": "${key}" } ] }, { "type": "text", "text": "`;
                    slugToLink.set(key, slugLink);
                }
            }
        }
    } else if (slugData.error) {

    }
    return slugToLink;
}
