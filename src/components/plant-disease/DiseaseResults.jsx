
import React from "react";
import { Share2, Download, Save, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const DiseaseResults = ({ 
  result, 
  onSaveDiagnosis, 
  onShareResults, 
  onDownloadResults,
  onAnalyzeAnother
}) => {
  if (!result) return null;

  return (
    <div className="mt-4 space-y-4">
      <Card>
        <CardHeader className="bg-plant-green text-white rounded-t-lg pb-2">
          <CardTitle className="text-lg">Disease Detected</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Plant</h3>
              <p>{result.plant || "Unknown plant"}</p>
            </div>
            
            <div>
              <h3 className="font-semibold">Disease</h3>
              <p>{result.disease}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold">Severity</h3>
              <p>{result.severity || "Moderate"}</p>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold">Treatment</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {result.treatment && result.treatment.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="font-semibold">Prevention</h3>
              <ul className="list-disc list-inside space-y-1 pl-2">
                {result.prevention && result.prevention.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onSaveDiagnosis}
        >
          <Save size={16} className="mr-1" />
          Save
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onShareResults}
        >
          <Share2 size={16} className="mr-1" />
          Share
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onDownloadResults}
        >
          <Download size={16} className="mr-1" />
          Download
        </Button>
      </div>
      
      {/* Analyze Another Button */}
      <Button 
        className="w-full bg-plant-green mt-2"
        onClick={onAnalyzeAnother}
      >
        Analyze Another Plant
        <ArrowRight size={16} className="ml-1" />
      </Button>
    </div>
  );
};

export default DiseaseResults;
