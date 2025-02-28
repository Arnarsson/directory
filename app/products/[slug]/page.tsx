import { notFound } from "next/navigation"

import { FadeIn } from "@/components/cult/fade-in"
import { getProductById } from "@/app/actions/product"

import { ProductDetails } from "./details"

const ProductIdPage = async ({ params }: { params: { slug: string } }) => {
  // Fix the params access to avoid Next.js warnings
  const slug = params?.slug || ""
  let data = await getProductById(slug)

  if (!data) {
    notFound()
  }

  return (
    <>
      <div className="z-10">
        <div className=" py-4 w-full relative  mx-auto max-w-6xl">
          <FadeIn>{data ? <ProductDetails product={data[0]} /> : null}</FadeIn>
        </div>
      </div>
    </>
  )
}

export default ProductIdPage
