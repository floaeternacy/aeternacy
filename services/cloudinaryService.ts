// services/cloudinaryService.ts

/**
 * æternacy™ Asset Optimization Service
 * Cloudinary wird EXKLUSIV für statische Website-Prefill-Assets verwendet.
 * Benutzer-Uploads werden aus Datenschutzgründen NICHT an Cloudinary gesendet.
 */

const CLOUD_NAME = "dpprbngqz"; 

/**
 * Generates an optimized URL for an existing Cloudinary asset.
 * Only applied to URLs belonging to the aeternacy institutional cloud.
 */
export const getOptimizedUrl = (url: string, width?: number): string => {
  if (!url || !url.includes("cloudinary.com")) return url;
  
  const baseParams = ["f_auto", "q_auto"];
  if (width) {
      baseParams.push(`w_${width}`);
      baseParams.push("c_limit");
  }
  
  const paramsString = baseParams.join(",");
  const uploadPattern = /\/upload\/(?:v\d+\/|[^\/]+\/v\d+\/|[^\/]+\/)?/;
  const match = url.match(uploadPattern);

  if (match) {
      const uploadIndex = url.indexOf('/upload/');
      const splitIndex = uploadIndex + 8;
      const baseUrl = url.substring(0, splitIndex);
      const restOfUrl = url.substring(splitIndex);
      
      if (restOfUrl.includes("f_auto") || restOfUrl.includes("q_auto")) {
          return url;
      }

      return `${baseUrl}${paramsString}/${restOfUrl}`;
  }

  return url;
};
