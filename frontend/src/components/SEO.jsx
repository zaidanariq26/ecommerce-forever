import { Helmet } from "react-helmet-async";
import PropTypes from "prop-types";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from "../constant";

export default function SEO({ title, description }) {
  const finalTitle = title ? `${title} - Forever` : DEFAULT_TITLE;
  const finalDescription = description || DEFAULT_DESCRIPTION;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
    </Helmet>
  );
}

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
};
