import UploadButton from "@/components/UploadButton";
import { useCMS } from "../store";

export default function () {
    const { selectedSection, updateProp } = useCMS();

    if (!selectedSection) return

    return (
        <>
            {
                Object.entries(selectedSection.props).map(([key, value]) => (
                    <div key={key}>
                        <label className="text-sm font-medium capitalize mb-2 block">
                            {key}
                        </label>

                        {Array.isArray(value) ? value.map((slide: any, i: number) => (
                            <div className="flex flex-col gap-3 my-2 shadow p-2">
                                {Object.entries(slide).map(([key]) => {

                                    if (key == 'id') {
                                        return null
                                    }
                                    else if (key == 'image') {
                                        return <UploadButton selectedSection={selectedSection} slide={slide} updateProp={updateProp} />
                                    }
                                    else {
                                        return (<input
                                            className="w-full border p-2 rounded"
                                            value={slide[key]}
                                            onChange={(e) =>
                                                updateProp(selectedSection.id, "slides", (prevSlides: any = []) =>
                                                    prevSlides.map((prevSlide: any) =>
                                                        prevSlide.id === slide.id
                                                            ? { ...prevSlide, [key]: e.target.value }
                                                            : prevSlide
                                                    )
                                                )
                                            }
                                        />)
                                    }

                                })}
                                {
                                    value.length > 1 &&
                                    <button
                                        type="submit"
                                        onClick={() =>
                                            updateProp(selectedSection.id, "slides", (prevSlides = []) =>
                                                prevSlides.filter((prevSlide: any) => prevSlide.id !== slide.id)
                                            )
                                        }
                                        className="cursor-pointer flex w-full justify-center rounded-md bg-[red] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                    > Delete Slide</button>
                                }

                                {i == value.length - 1 && <button
                                    type="submit"
                                    onClick={() =>
                                        updateProp(selectedSection.id, "slides", (prevSlides = []) => [
                                            ...prevSlides,
                                            {
                                                id: crypto.randomUUID(),
                                                title: "New Slide",
                                                subTitle: "Subtitle",
                                                image: "",
                                            },
                                        ])
                                    }
                                    className="cursor-pointer flex w-full justify-center rounded-md bg-[#0F172A] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
                                >➕ Add Slide</button>}
                            </div>

                        )) : key === "bg" ? (
                            <input
                                type="color"
                                value={value}
                                onChange={(e) =>
                                    updateProp(selectedSection.id, key, e.target.value)
                                }
                                className="w-full h-8 rounded-md overflow-hidden"
                            />
                        ) : (
                            <input
                                className="w-full border p-2 rounded"
                                value={value}
                                onChange={(e) =>
                                    updateProp(selectedSection.id, key, e.target.value)
                                }
                            />
                        )}
                    </div>
                ))
            }
        </>
    )
}