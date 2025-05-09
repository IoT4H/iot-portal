import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fetchAPI } from '@iot-portal/frontend/lib/api'

export function mapUseCase(useCase: any, keyWordMap: Map<string, string>): UseCase {

  let title = useCase.attributes.Titel
  let description = useCase.attributes.description
  let summary = useCase.attributes.summary

  keyWordMap.forEach((link, key) => {
    title = title.replace(key, link)
    description = description.replace(key, link)
    summary = summary.replace(key, link)
  })

  return {
    id: useCase.id,
    title: title,
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

  for (var entry of slugData.data) {
    let keyWords = entry.attributes.keyWords
    if (keyWords) {
      for (var key of keyWords) {
        let slugLink = `[${key}](/api/wissen/${entry.attributes.slug})`
        slugToLink.set(key, slugLink)
      }
    }
  }


  return slugToLink
} 
