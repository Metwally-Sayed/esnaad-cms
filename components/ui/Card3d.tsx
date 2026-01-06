"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CardTransform {
  rotateX: number;
  rotateY: number;
  scale: number;
}

type Card3dProps = {
  title: string;
  description: string;
  image?: string;
};

const Card3d = ({ title, description, image }: Card3dProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastMousePosition = useRef({ x: 0, y: 0 });
  const imageSrc =
    image ||
    "https://cdn.shadcnstudio.com/ss-assets/components/card/image-10.png?width=350&format=auto";

  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;

    if (!card || !image) return;

    let rect: DOMRect;
    let centerX: number;
    let centerY: number;

    const updateCardTransform = (mouseX: number, mouseY: number) => {
      if (!rect) {
        rect = card.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
      }

      const relativeX = mouseX - centerX;
      const relativeY = mouseY - centerY;

      const cardTransform: CardTransform = {
        rotateX: -relativeY * 0.035,
        rotateY: relativeX * 0.035,
        scale: 1.025,
      };

      const imageTransform: CardTransform = {
        rotateX: -relativeY * 0.025,
        rotateY: relativeX * 0.025,
        scale: 1.05,
      };

      return { cardTransform, imageTransform };
    };

    const animate = () => {
      const { cardTransform, imageTransform } = updateCardTransform(
        lastMousePosition.current.x,
        lastMousePosition.current.y
      );

      card.style.transform = `perspective(1000px) rotateX(${cardTransform.rotateX}deg) rotateY(${cardTransform.rotateY}deg) scale3d(${cardTransform.scale}, ${cardTransform.scale}, ${cardTransform.scale})`;
      card.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.2)";

      image.style.transform = `perspective(1000px) rotateX(${imageTransform.rotateX}deg) rotateY(${imageTransform.rotateY}deg) scale3d(${imageTransform.scale}, ${imageTransform.scale}, ${imageTransform.scale})`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseEnter = () => {
      card.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
      image.style.transition = "transform 0.2s ease";
      animate();
    };

    const handleMouseLeave = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      card.style.boxShadow = "none";
      card.style.transition = "transform 0.5s ease, box-shadow 0.5s ease";

      image.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)";
      image.style.transition = "transform 0.5s ease";
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <Card ref={cardRef} className="max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 text-sm">
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            ref={imageRef}
            src={imageSrc}
            alt="Banner"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <p>{description}</p>
      </CardContent>
    </Card>
  );
};

export default Card3d;
