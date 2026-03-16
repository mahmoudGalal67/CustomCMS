import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

import { useCMS, type BannerProps } from "../store";


interface BannerCompponentProps extends BannerProps {
    id: string;
}


export default function Banner({ slides, id }: BannerCompponentProps) {
    const { selectedSection } = useCMS();
    const active = selectedSection?.id === id;
    const isEditable = !!active; // or pass editable prop

    return (
        <section className={isEditable ? "pointer-events-none" : ""}>
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="w-full h-[400px] md:h-[600px]"
            >
                {slides.map(slide => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="w-full h-full bg-cover bg-center flex items-center justify-center text-white"
                            style={{ backgroundImage: `url(${import.meta.env.VITE_API_URL}${slide.image})` }}
                        >
                            <div className="text-center bg-black/30 p-6 rounded">
                                <h2 className="text-3xl md:text-5xl font-bold">{slide.title}</h2>
                                <p className="mt-2 text-lg md:text-2xl">{slide.subTitle}</p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    )
}