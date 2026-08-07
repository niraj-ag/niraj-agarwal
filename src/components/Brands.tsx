import { useState } from "react";
import { COMPANY_BRANDS, TECH_BRANDS } from "../data/brands";

function useLogo(src: string | undefined) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return { src: null, onError: () => {} };
  return {
    src,
    onError: () => setFailed(true),
  };
}

export function BrandLogo({
  name,
  size = 13,
}: {
  name: string;
  size?: number;
}) {
  const brand = TECH_BRANDS[name];
  const color = brand?.color ?? "71717A";
  const rawSrc = brand
    ? `https://cdn.simpleicons.org/${brand.slug}/${color}`
    : undefined;
  const { src, onError } = useLogo(rawSrc);
  if (!brand || !src) return null;
  return (
    <span className="brand-logo" aria-hidden="true">
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={onError}
        style={{ width: size, height: size }}
      />
    </span>
  );
}

export default function TechPill({ name }: { name: string }) {
  return (
    <span className="tech-pill">
      <BrandLogo name={name} size={13} />
      <span>{name}</span>
    </span>
  );
}

export function CompanyBadge({ name }: { name: string }) {
  const brand = COMPANY_BRANDS[name];
  const color = brand?.color ?? "FFFFFF";
  const { src, onError } = useLogo(
    brand ? `https://cdn.simpleicons.org/${brand.slug}/${color}` : undefined
  );

  if (brand && src) {
    return (
      <img
        className="company-logo"
        src={src}
        alt={`${name} logo`}
        width={16}
        height={16}
        loading="lazy"
        onError={onError}
      />
    );
  }

  return (
    <span className="company-monogram" aria-hidden="true" title={name}>
      {name.charAt(0)}
    </span>
  );
}