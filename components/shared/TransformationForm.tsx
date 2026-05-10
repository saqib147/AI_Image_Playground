"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  aspectRatioOptions,
  creditFee,
  defaultValues,
  transformationTypes,
} from "@/constants";
import { CustomField } from "./CustomField";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState, useTransition } from "react";
import { AspectRatioKey, debounce, deepMergeObjects } from "@/lib/utils";
import { updateCredits } from "@/lib/actions/user.actions";
import MediaUploader from "./MediaUploader";
import TransformedImage from "./TransformedImage";
import { getCldImageUrl } from "next-cloudinary";
import { addImage, updateImage } from "@/lib/actions/image.actions";
import { useRouter } from "next/navigation";
import { InsufficientCreditsModal } from "./InsufficentCreditsModal";

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

// ─── Icons ───────────────────────────────────────────────────────────────────

const SlidersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-purple-400"
  >
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z" />
  </svg>
);

const UploadCloudIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);

// ─── Component ───────────────────────────────────────────────────────────────

const TransformationForm = ({
  action,
  data = null,
  userId,
  type,
  creditBalance,
  config = null,
}: TransformationFormProps) => {
  const transformationType = transformationTypes[type];
  const [image, setImage] = useState(data);
  const [newTransformation, setNewTransformation] =
    useState<Transformations | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [transformationConfig, setTransformationConfig] = useState(config);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const initialValues =
    data && action === "Update"
      ? {
          title: data?.title,
          aspectRatio: data?.aspectRatio,
          color: data?.color,
          prompt: data?.prompt,
          publicId: data?.publicId,
        }
      : defaultValues;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    if (data || image) {
      const transformationUrl = getCldImageUrl({
        width: image?.width,
        height: image?.height,
        src: image?.publicId,
        ...transformationConfig,
      });

      const imageData = {
        title: values.title,
        publicId: image?.publicId,
        transformationType: type,
        width: image?.width,
        height: image?.height,
        config: transformationConfig,
        secureURL: image?.secureURL,
        transformationURL: transformationUrl,
        aspectRatio: values.aspectRatio,
        prompt: values.prompt,
        color: values.color,
      };

      if (action === "Add") {
        try {
          const newImage = await addImage({
            image: imageData,
            userId,
            path: "/",
          });
          if (newImage) {
            form.reset();
            setImage(data);
            router.push(`/transformations/${newImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      if (action === "Update") {
        try {
          const updatedImage = await updateImage({
            image: { ...imageData, _id: data._id },
            userId,
            path: `/transformations/${data._id}`,
          });
          if (updatedImage) {
            router.push(`/transformations/${updatedImage._id}`);
          }
        } catch (error) {
          console.log(error);
        }
      }

      setIsSubmitting(false);
    }
    console.log(data);
  }

  const onSelectFieldHandler = (
    value: string,
    onChangeField: (value: string) => void,
  ) => {
    const imgSize = aspectRatioOptions[value as AspectRatioKey];
    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imgSize.aspectRatio,
      width: imgSize.width,
      height: imgSize.height,
    }));
    setNewTransformation(transformationType.config);
    onChangeField(value);
  };

  const onInputChangeHandler = (
    fieldName: string,
    value: string,
    type: string,
    onChangeField: (value: string) => void,
  ) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]: {
          ...prevState?.[type],
          [fieldName === "prompt" ? "prompt" : "to"]: value,
        },
      }));
    }, 1000)();
    return onChangeField(value);
  };

  const onTransformHandler = async () => {
    setIsTransforming(true);
    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationConfig),
    );
    setNewTransformation(null);
    startTransition(async () => {
      await updateCredits(userId, creditFee);
    });
  };

  useEffect(() => {
    if (image && (type === "restore" || type === "removeBackground")) {
      setNewTransformation(transformationType.config);
    }
  }, [image, transformationType.config, type]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {creditBalance < Math.abs(creditFee) && <InsufficientCreditsModal />}

        {/* ── 3-column layout ───────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row items-start gap-5">
          {/* ═══════════════════════════════════════════════════
              LEFT — Configuration Panel
          ═══════════════════════════════════════════════════ */}
          <div
            className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0
                          rounded-2xl border border-white/[0.08] bg-[#181b26]
                          p-6 flex flex-col gap-5"
          >
            {/* Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
              <SlidersIcon />
              <span className="font-semibold text-[15px] text-white tracking-tight">
                Configuration
              </span>
            </div>

            {/* Project Title */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-white/50 tracking-wide">
                Project Title
              </label>
              <CustomField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <Input
                    {...field}
                    className="h-[46px] rounded-xl border border-white/10 bg-white/5 px-4
                               text-white placeholder:text-white/25 text-[14px] font-normal
                               focus-visible:ring-0 focus-visible:ring-offset-0
                               focus-visible:border-purple-500/50 transition-colors duration-200"
                    placeholder="e.g. Expanded Mountain Vista"
                  />
                )}
              />
            </div>

            {/* Aspect Ratio — fill type only */}
            {type === "fill" && (
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-white/50 tracking-wide">
                  Target Aspect Ratio
                </label>
                <CustomField
                  control={form.control}
                  name="aspectRatio"
                  className="w-full"
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) =>
                        onSelectFieldHandler(value, field.onChange)
                      }
                      value={field.value}
                    >
                      <SelectTrigger
                        className="h-[46px] w-full rounded-xl border border-white/10
                                   bg-white/5 px-4 text-white text-[14px] font-normal
                                   focus:ring-0 focus:ring-offset-0
                                   data-[state=open]:border-purple-500/50
                                   transition-colors duration-200"
                      >
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent
                        className="rounded-xl border border-white/10
                                   bg-[#1e2133] text-white shadow-2xl shadow-black/40"
                      >
                        <SelectGroup>
                          {Object.keys(aspectRatioOptions).map((key) => (
                            <SelectItem
                              key={key}
                              value={key}
                              className="text-[14px] text-white/80 cursor-pointer rounded-lg
                                         focus:bg-purple-500/20 focus:text-white py-2.5"
                            >
                              {aspectRatioOptions[key as AspectRatioKey].label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* Prompt — remove / recolor types */}
            {(type === "remove" || type === "recolor") && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-medium text-white/50 tracking-wide">
                    {type === "remove"
                      ? "Object to Remove"
                      : "Object to Recolor"}
                  </label>
                  <CustomField
                    control={form.control}
                    name="prompt"
                    className="w-full"
                    render={({ field }) => (
                      <Input
                        value={field.value}
                        className="h-[46px] rounded-xl border border-white/10 bg-white/5 px-4
                                   text-white placeholder:text-white/25 text-[14px]
                                   focus-visible:ring-0 focus-visible:ring-offset-0
                                   focus-visible:border-purple-500/50 transition-colors duration-200"
                        placeholder={
                          type === "remove"
                            ? "e.g. tree, car..."
                            : "e.g. sky, shirt..."
                        }
                        onChange={(e) =>
                          onInputChangeHandler(
                            "prompt",
                            e.target.value,
                            type,
                            field.onChange,
                          )
                        }
                      />
                    )}
                  />
                </div>

                {type === "recolor" && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-medium text-white/50 tracking-wide">
                      Replacement Color
                    </label>
                    <CustomField
                      control={form.control}
                      name="color"
                      className="w-full"
                      render={({ field }) => (
                        <Input
                          value={field.value}
                          className="h-[46px] rounded-xl border border-white/10 bg-white/5 px-4
                                     text-white placeholder:text-white/25 text-[14px]
                                     focus-visible:ring-0 focus-visible:ring-offset-0
                                     focus-visible:border-purple-500/50 transition-colors duration-200"
                          placeholder="e.g. red, #FF5733..."
                          onChange={(e) =>
                            onInputChangeHandler(
                              "color",
                              e.target.value,
                              "recolor",
                              field.onChange,
                            )
                          }
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                type="button"
                disabled={isTransforming || newTransformation === null}
                onClick={onTransformHandler}
                className="h-[46px] w-full rounded-xl font-semibold text-[14px] text-white
                           flex items-center justify-center gap-2 border-0
                           bg-gradient-to-r from-[#3a14e0] to-[#7857FF]
                           hover:opacity-90 hover:shadow-lg hover:shadow-purple-600/30
                           active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200"
              >
                {isTransforming ? (
                  <>
                    <span className="btn-spinner" /> Transforming...
                  </>
                ) : (
                  <>
                    <SparklesIcon /> Apply Changes
                  </>
                )}
              </Button>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-[46px] w-full rounded-xl font-semibold text-[14px] text-white
                           flex items-center justify-center gap-2 border-0
                           bg-gradient-to-r from-[#7857FF] to-[#9B8FFF]
                           hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/30
                           active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed
                           transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <span className="btn-spinner" /> Saving...
                  </>
                ) : (
                  <>
                    <UploadCloudIcon /> Save Image
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════
              MIDDLE — Upload Area
              Uses flex (not absolute) so MediaUploader fills naturally
          ═══════════════════════════════════════════════════ */}
          <div
            className="flex-1 rounded-2xl border-2 border-dashed border-white/[0.12]
                        flex flex-col min-h-[460px] overflow-hidden
                        hover:border-purple-500/25 transition-colors duration-200"
          >
            {/*
              Pass className to FormItem so it grows to fill the dashed container.
              MediaUploader's root div is also flex flex-col h-full so it fills too.
            */}
            <CustomField
              control={form.control}
              name="publicId"
              className="flex flex-col flex-1 "
              render={({ field }) => (
                <MediaUploader
                  onValueChange={field.onChange}
                  setImage={setImage}
                  publicId={field.value}
                  image={image}
                  type={type}
                />
              )}
            />
          </div>

          {/* ═══════════════════════════════════════════════════
              RIGHT — Transformed Image Preview
          ═══════════════════════════════════════════════════ */}
          <div
            className="w-full lg:w-[300px] xl:w-[320px] flex-shrink-0
                        rounded-2xl bg-[#181b26] overflow-hidden flex flex-col
                        min-h-[460px]"
            style={{
              border: "1px solid rgba(120, 87, 255, 0.25)",
              boxShadow:
                "0 0 0 1px rgba(120,87,255,0.08), 0 0 40px rgba(120,87,255,0.12), inset 0 1px 0 rgba(155,143,255,0.25)",
            }}
          >
            {/* Purple gradient top bar */}
            <div
              className="h-[2px] w-full flex-shrink-0"
              style={{
                background:
                  "linear-gradient(90deg, #7857FF 0%, #9B8FFF 55%, transparent 100%)",
              }}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
              <TransformedImage
                image={image}
                type={type}
                title={form.getValues().title}
                isTransforming={isTransforming}
                setIsTransforming={setIsTransforming}
                transformationConfig={transformationConfig}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default TransformationForm;
