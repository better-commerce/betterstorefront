import { useTranslation } from "@commerce/utils/use-translation";
import React from "react";

const PostCardMetaV2 = () => {
  const translate = useTranslation()
  return <div>{translate('common.label.postCardMetaV2Text')}</div>;
};

export default PostCardMetaV2;
