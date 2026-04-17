import fullLogo from "../assets/logo/500x90-logo-tp.png";
import textLogo from "../assets/logo/500x125-text-tp.png";
import iconLogo from "../assets/logo/500sq-tp.png";

export default function AppLogo({
  type = "full",
  width = 180,
  alt = "MediCare logo",
  style = {}
}) {
  let src = fullLogo;

  if (type === "text") src = textLogo;
  if (type === "icon") src = iconLogo;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width,
        height: "auto",
        display: "block",
        objectFit: "contain",
        ...style
      }}
    />
  );
}