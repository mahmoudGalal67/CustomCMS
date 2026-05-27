import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import { useCMS } from "../store";
import { type sliderFeaturedProductsProps } from "../Types";
import { useGetProductsByNamesOrIdsQuery } from '@/services/ProductsApi';


interface sliderFeaturedProductsCompponentProps extends sliderFeaturedProductsProps {
    id: string;
}


export default function featuredSliderProducts({ products, title, id, slider }: sliderFeaturedProductsCompponentProps) {
    const { selectedSection } = useCMS();
    const { data: FilteredPRoducts } = useGetProductsByNamesOrIdsQuery({ ids: products });
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop
    return (
        <section className={isEditable ? "pointer-events-none" : ""}>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-8">{title}</h2>

                    {slider ? <Swiper
                        modules={[Autoplay, Pagination]}
                        autoplay={{ delay: 4000, disableOnInteraction: false }}
                        slidesPerView={4} spaceBetween={20}
                        pagination={{ clickable: true }}
                        navigation
                        loop
                        className="w-full h-[400px] md:h-[500px]"
                    >
                        {FilteredPRoducts?.map((item: any) => (
                            <SwiperSlide key={item.id}>
                                <div key={item.id} className="group relative">
                                    <img
                                        alt={item.imageAlt}
                                        src={item.base_images ? `${import.meta.env.VITE_API_URL}/storage/${item.base_images}` : `${import.meta.env.VITE_API_URL}/storage/${item.variants[0].images[0].file_path}`}
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
                                        <p className="text-sm font-medium text-gray-900">$ {item.base_price !== '0.00' ? item.base_price : item.variants[0]?.price} </p>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper> : <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {FilteredPRoducts?.map((item: any) => (
                            <div key={item.id} className="group relative">
                                <img
                                    alt={item.imageAlt}
                                    src={item.base_images ? `${import.meta.env.VITE_API_URL}/storage/${item.base_images}` : `${import.meta.env.VITE_API_URL}/storage/${item.variants[0].images[0].file_path}`}
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
                                    <p className="text-sm font-medium text-gray-900">$ {item.base_price !== '0.00' ? item.base_price : item.variants[0]?.price} </p>
                                </div>
                            </div>
                        ))}
                    </div>}
                </div>
            </div>

        </section>
    )
}