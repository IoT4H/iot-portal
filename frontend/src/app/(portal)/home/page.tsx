import { ListItemUseCase, ListUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fakerDE as faker } from "@faker-js/faker"
export default function Home() {

    const generateUSeCases = () => {
        return {
            title: faker.word.words({count: 3}),
            description: faker.lorem.paragraph(),
            badges: faker.helpers.multiple(faker.word.noun,  {count: {min: 5, max: 7}})
        }
    };

    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListUseCase title={"Beispiel Use-Cases"}>
                {
                    faker.helpers.uniqueArray(generateUSeCases, 10).map(useCase =>
                        <ListItemUseCase key={useCase.title} title={useCase.title} description={useCase.description} badges={useCase.badges}/>
                    )
                }
            </ListUseCase>

            <ListUseCase title={"Merkliste"}>
                {
                    faker.helpers.uniqueArray(generateUSeCases, 10).map(useCase =>
                        <ListItemUseCase key={useCase.title} title={useCase.title} description={useCase.description} badges={useCase.badges}/>
                    )
                }
            </ListUseCase>

        </div>
    );
}
