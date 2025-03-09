import { PortableText, type SanityDocument } from "next-sanity";

type PostBodyProps = {
    body: object;
}

export function PostBody({ body }: PostBodyProps) {
  return (
    <div className="px-12 mx-auto">
        <div className="prose">
            {Array.isArray(body) && <PortableText value={body} />}
        </div>
    </div>
  );
}
