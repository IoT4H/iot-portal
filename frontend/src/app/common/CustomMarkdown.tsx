import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import ReactMarkdown from "react-markdown";

export default function CustomMarkdown({children, className, ...rest} : { children: string, className: string }) {

    return <ReactMarkdown className={`${className} *:mb-[1.5rem] *:last:mb-0`} components={
        {
            h1: "h2",
            h2: "h3",
            h3: "h4",
            h4: "h5",
            h5: "h5",
            h6: "b",
            img(props) {
                const {node, ...rest} = props;

                if(!rest.src) {
                    return null;
                }
                const thumbnail = rest.src.replace("/uploads/", "/uploads/thumbnail_")

                return  <GalleryImage  {...rest} src={rest.src} />;
            },
            p(props) {
                return <p className={"mb-[1.5rem] last:mb-0"}>{props.children}</p>;
            },
            blockquote(props) {
                return <blockquote className={"p-2 border-l-4 border-orange-500 mb-[1.5rem] last:mb-0"}>{props.children}</blockquote>;
            }
        }
    } {...rest} >{ children }</ReactMarkdown>
}
