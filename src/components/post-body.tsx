import { PortableText, type SanityDocument } from "next-sanity";

type PostBodyProps = {
    body: object;
}

export function PostBody({ body }: PostBodyProps) {
  return (
    <div className="px-12 mx-auto">
        <div className="prose">
            // TODO: Modify to render text, images & code blocks properly
            {Array.isArray(body) && <PortableText value={body} />}
        </div>
    </div>
  );
}
