
import React from "react";
import PageLayout from "@/components/PageLayout";
import PlantDiseaseDetector from "@/components/plant-disease/PlantDiseaseDetector";

const PlantDisease = () => {
  return (
    <PageLayout title="Plant Disease Detection" showBack>
      <PlantDiseaseDetector />
    </PageLayout>
  );
};

export default PlantDisease;
