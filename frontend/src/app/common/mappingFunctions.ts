import { UseCase } from "@iot-portal/frontend/app/(portal)/use-cases";

export function mapUseCase(useCase: any): UseCase {
    return {
        id: useCase.id,
        title: useCase.attributes.Titel,
        slug: useCase.attributes.slug,
        thumbnail: useCase.attributes.thumbnail && useCase.attributes.thumbnail.data && useCase.attributes.thumbnail.data.attributes && useCase.attributes.thumbnail.data.attributes.url && useCase.attributes.thumbnail.data.attributes || undefined,
        summary: useCase.attributes.summary,
        description: useCase.attributes.description,
        pictures: useCase.attributes.pictures && useCase.attributes.pictures.data && useCase.attributes.pictures.data.map((b: any) => b.attributes) || [],
        tags: (useCase.attributes.tags && useCase.attributes.tags.data.map((t :any) => t.attributes.name)) || [],
        devices:  (useCase.attributes.Images && useCase.attributes.Images.filter((i:any) => i.device.data !== null)) || [],
        setupDuration: useCase.attributes.setupDuration,
        complexity: useCase.attributes.complexity,
        instructions: useCase.attributes.instructions,
        costs: useCase.attributes.costs,
        firms: (useCase.attributes.firms && useCase.attributes.firms.data.map((f :any) => f.attributes)) || [],
        partnerLogos: useCase.attributes.partnerLogos && useCase.attributes.partnerLogos.data && useCase.attributes.partnerLogos.data.map((b: any) => b.attributes) || [],
        setupSteps: useCase.attributes.setupSteps || []
    }
}

export function generateSlugToLinkMap(slugData: any): Map<string, string> {

  let slugToLink = new Map<string, string>();

  for (var entry of slugData.data) {
    slugToLink.set(entry.attributes.slug, `/api/wissen/${entry.attributes.slug}`)

  }


  return slugToLink
} 
