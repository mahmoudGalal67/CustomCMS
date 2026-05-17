import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useGetProductsByNamesOrIdsQuery } from "@/services/ProductsApi";



const useCountdown = (endTime: string) => {

    const calculateTimeLeft = () => {
        const difference = new Date(endTime).getTime() - new Date().getTime();

        if (difference <= 0) return null;

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        };
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    return timeLeft;
};

const Countdown = ({ endTime }: { endTime: string }) => {
    const timeLeft = useCountdown(endTime);

    if (!timeLeft) return <span className="text-red-500">Expired</span>;

    return (
        <div className="flex gap-2 text-sm font-medium">
            {Object.entries(timeLeft).map(([key, value]) => (
                <div key={key} className="bg-black text-white px-2 py-1 rounded-md">
                    {value} {key}
                </div>
            ))}
        </div>
    );
};

export default function CountdownOffers({ offers, title, id }: any) {

    const { data: FilteredPRoducts } = useGetProductsByNamesOrIdsQuery({ ids: offers.map((o: any) => o.offerProduct) });
    return (
        <section className="py-12 px-6 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold mb-8">🔥{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.map((offer: any) => {
                        const product = FilteredPRoducts?.find(
                            (p: any) => p?.id === offer?.offerProduct
                        ) || {};

                        return (
                            <motion.div key={offer.id} whileHover={{ scale: 1.05 }} className="rounded-2xl">
                                <Card className="overflow-hidden shadow-lg">
                                    <img
                                        src={
                                            product.base_images
                                                ? `${import.meta.env.VITE_API_URL}/storage/${product.base_images[0]}`
                                                : product?.variants?.[0]?.images?.[0]?.file_path
                                                    ? `${import.meta.env.VITE_API_URL}/storage/${product.variants[0].images[0].file_path}`
                                                    : "https://via.placeholder.com/400x300?text=No+Image"
                                        }
                                        className="w-full h-48 object-cover"
                                    />
                                    <CardContent className="p-4 space-y-3">
                                        <h3 className="text-lg font-semibold">{offer.offerValue}% Discount</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-green-600">
                                                {(product?.base_price !== "0.00" ? Number(product.base_price) : Number(product?.variants?.[0]?.price || 0)) *
                                                    (1 - offer.offerValue / 100)}
                                            </span>
                                            <span className="line-through text-gray-400">
                                                ${product?.base_price !== "0.00" ? product.base_price : product?.variants?.[0]?.price || 0}
                                            </span>
                                        </div>
                                        <Countdown endTime={offer.date} />
                                        <Button className="w-full">Buy Now</Button>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
