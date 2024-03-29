import GalleryImage from "@iot-portal/frontend/app/common/galleryImage";
import ReactMarkdown from "react-markdown";

export default function CustomMarkdown({children, className, ...rest} : { children: string, className: string }) {

    return <ReactMarkdown className={className} components={
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
            }
        }
    } {...rest} >{ children }</ReactMarkdown>
}
