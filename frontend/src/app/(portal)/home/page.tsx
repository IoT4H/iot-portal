import { ListItemUseCase, ListUseCase } from "@iot-portal/frontend/app/(portal)/use-cases";
import { fakerDE as faker } from "@faker-js/faker"
export default function Home() {
    return (
        <div className="flex flex-row content-stretch gap-12">
            <ListUseCase title={"Beispiel Use-Cases"}>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
            </ListUseCase>

            <ListUseCase title={"Merkliste"}>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
                <ListItemUseCase title={faker.word.words({ count: 3 })} description={faker.lorem.paragraph()}/>
            </ListUseCase>

        </div>
    );
}
