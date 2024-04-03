"use client";
import React from "react";
import WelcomePage from "../components/WelcomePage";
import GeoLocator from "../components/GeoLocator";
import GWAS from "../components/GWAS";
import PCA from "../components/PCA";
import MDS from "../components/MDS";
import View from "../components/GenomeBrowser";
import FAQs from "../components/FAQs";
import Contact from "../components/Contact";
import Downloads from "../components/Downloads";
import { VisPheno } from "../components/VisPheno";
import { usePathname, useSearchParams } from "next/navigation";
import Login from "../components/LoginPage";
import SummaryStatistics from "../components/SummaryStatistics";
import PhyloTreeComp from "../components/PhyloTreeComp";


const DynamicRenderer = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const componentName = searchParams.get("component");

  const renderComponent = () => {
    switch (componentName) {
        case "home":
        return <WelcomePage />;

      case "germplasm":
        return <GeoLocator />;

      case "vispheno":
        return <VisPheno />;

        case "summary_statistics":
          return <SummaryStatistics />;
  
  
      case "gwas":
        return <GWAS />;

      case "jb":
        return <View />;

      case "pca":
        return <PCA />;
      case "mds":
        return <MDS />;

      case "downloads":
        return <Downloads />;
      case "faqs":
        return <FAQs />;

      case "contact":
        return <Contact />;
      
        case "PhyloTreeComp":
          return <PhyloTreeComp />;

      default:
        return <div>Component not found</div>;
    }
  };

  return <div>{renderComponent()}</div>;
};

export default DynamicRenderer;
