export default function PromptAreaComponent() {
    return (
        <div
            id={"promptArea"}
            className={
                "empty:hidden fixed w-[100vw] h-[100vh]  z-[90] backdrop-blur-[4px] bg-zinc-950/40 flex flex-col justify-center items-center flex-wrap top-0 left-0"
            }
        ></div>
    );
}
