import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import { useCMS, type sliderFeaturedProductsProps } from "../store";
import { useGetProductsByNamesOrIdsQuery } from '@/services/ProductsApi';
import { useEffect } from 'react';


interface sliderFeaturedProductsCompponentProps extends sliderFeaturedProductsProps {
    id: string;
}


export default function featuredSliderProducts({ products, title, id }: sliderFeaturedProductsCompponentProps) {
    const { selectedSection } = useCMS();
    const { data: FilteredPRoducts } = useGetProductsByNamesOrIdsQuery({ ids: products });
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop
    console.log(products)
    return (
        <section className={isEditable ? "pointer-events-none" : ""}>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>

                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {FilteredPRoducts?.map((item: any) => (
                            <div key={item.id} className="group relative">
                                <img
                                    alt={item.imageAlt}
                                    src={item.imageSrc}
                                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                                />
                                <div className="mt-4 flex justify-between">
                                    <div>
                                        <h3 className="text-sm text-gray-700">
                                            <span aria-hidden="true" className="absolute inset-0" />
                                            {item.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                                    </div>
                                    <p className="text-sm font-medium text-gray-900">$ {item.base_price} </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="w-full h-[400px] md:h-[600px]"
            >
                {products.map(product => (
                    <SwiperSlide key={product.id}>
                        <div
                            className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
                            style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL}${product.image})` }}
                        >
                            <div className="text-center bg-black/30 p-6 rounded">
                                <h2 className="text-3xl md:text-5xl font-bold">{product.title}</h2>
                                <p className="mt-2 text-lg md:text-2xl">{product.subTitle}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper> */}
        </section>
    )
}