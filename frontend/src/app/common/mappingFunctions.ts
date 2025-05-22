import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";

export function mapUseCase(useCase: any, keyWordMap: Map<string, string> = new Map<string, string>()): UseCase {

  let description: string = useCase.attributes.description
  let summary: string = useCase.attributes.summary
  if (keyWordMap) {
    keyWordMap.forEach((link, key) => {
      // escape "\" otherwise regex creation fails 
      const regexString: string = "(?<!\\[)__KEY__[a-zA-Z]{0,2}(?!\\])".replace("__KEY__", key)

      let keyRegex: RegExp = new RegExp(regexString, "g")

      if (description != undefined) {
        let uniqueDescriptionMatch: Set<string> = new Set<string>(description.match(keyRegex))

        for (let uniqueKey of Array.from(uniqueDescriptionMatch)) {
          // "\" must be escaped otherwise the regex matches everything
          let replaceRegex: RegExp = new RegExp(`(?<!\\[)${uniqueKey}(?!\\])`, "g")
          let linkUpdate: string = link.replace(key, uniqueKey)
          description = description.replace(replaceRegex, linkUpdate)
        }
      }
      if (summary != undefined) {
        let uniqueSummaryMatch: Set<string> = new Set<string>(summary.match(keyRegex))
        for (let uniqueKey of Array.from(uniqueSummaryMatch)) {
          // "\" must be escaped otherwise the regex matches everything
          let replaceRegex: RegExp = new RegExp(`(?<!\\[)${uniqueKey}(?!\\])`, "g")
          let linkUpdate: string = link.replace(key, uniqueKey)
          summary = summary.replace(replaceRegex, linkUpdate)
        }
      }
    })
  }

  return {
    id: useCase.id,
    title: useCase.attributes.title,
    slug: useCase.attributes.slug,
    thumbnail: useCase.attributes.thumbnail && useCase.attributes.thumbnail.data && useCase.attributes.thumbnail.data.attributes && useCase.attributes.thumbnail.data.attributes.url && useCase.attributes.thumbnail.data.attributes || undefined,
    summary: summary,
    description: description,
    pictures: useCase.attributes.pictures && useCase.attributes.pictures.data && useCase.attributes.pictures.data.map((b: any) => b.attributes) || [],
    tags: (useCase.attributes.tags && useCase.attributes.tags.data.map((t: any) => t.attributes.name)) || [],
    devices: (useCase.attributes.Images && useCase.attributes.Images.filter((i: any) => i.device.data !== null)) || [],
    setupDuration: useCase.attributes.setupDuration,
    complexity: useCase.attributes.complexity,
    instructions: useCase.attributes.instructions,
    costs: useCase.attributes.costs,
    firms: (useCase.attributes.firms && useCase.attributes.firms.data.map((f: any) => f.attributes)) || [],
    partnerLogos: useCase.attributes.partnerLogos && useCase.attributes.partnerLogos.data && useCase.attributes.partnerLogos.data.map((b: any) => b.attributes) || [],
    setupSteps: useCase.attributes.setupSteps || []
  }

}

export function generateSlugToLinkMap(slugData: any): Map<string, string> {

  let slugToLink = new Map<string, string>();
  if (slugData.data) {
    for (let entry of slugData.data) {
      let keyWords = entry.attributes.keyWords;
      if (Array.isArray(keyWords)) {
        for (let key of keyWords) {
          let slugLink = `[${key}](/api/wissen/${entry.attributes.slug})`
          slugToLink.set(key, slugLink)
        }
      }
    }
  } else if (slugData.error) {
    console.log(slugData.error)
  }
  return slugToLink
}
