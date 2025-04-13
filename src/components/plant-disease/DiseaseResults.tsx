
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookMarked, Download, Share2 } from "lucide-react";

interface DiseaseResultsProps {
  result: any;
  onSaveDiagnosis: () => void;
  onShareResults: () => void;
  onDownloadResults: () => void;
  onAnalyzeAnother: () => void;
}

const DiseaseResults: React.FC<DiseaseResultsProps> = ({
  result,
  onSaveDiagnosis,
  onShareResults,
  onDownloadResults,
  onAnalyzeAnother,
}) => {
  if (!result) return null;

  return (
    <div className="mt-6 bg-secondary p-4 rounded-lg">
      <div className="flex flex-col">
        {result.plant && result.plant !== "Unknown" && (
          <div className="flex flex-col">
            <span className="text-sm text-gray-500">Plant:</span>
            <span className="font-medium">{result.plant}</span>
          </div>
        )}
        <h3 className="font-semibold text-lg mt-2">Disease: {result.disease}</h3>
      </div>
      
      {result.summary && (
        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <p className="text-sm">{result.summary}</p>
        </div>
      )}
      
      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value="symptoms">
          <AccordionTrigger className="text-md font-medium">Symptoms</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">{result.symptoms}</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="cause">
          <AccordionTrigger className="text-md font-medium">Cause</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">{result.cause}</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="treatment">
          <AccordionTrigger className="text-md font-medium">Treatment</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">{result.treatment}</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="prevention">
          <AccordionTrigger className="text-md font-medium">Prevention</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm whitespace-pre-line">{result.prevention}</p>
          </AccordionContent>
        </AccordionItem>
        
        {result.additionalInfo && (
          <AccordionItem value="additional">
            <AccordionTrigger className="text-md font-medium">Additional Information</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm whitespace-pre-line">{result.additionalInfo}</p>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
      
      {/* Action Buttons */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button 
          className="w-full bg-plant-green" 
          onClick={onSaveDiagnosis}
        >
          <BookMarked className="mr-2 h-4 w-4" />
          Save Diagnosis
        </Button>
        
        <Button
          className="w-full"
          variant="outline"
          onClick={onShareResults}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        
        <Button
          className="w-full col-span-2"
          variant="secondary"
          onClick={onDownloadResults}
        >
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Try Another Button */}
      <Button 
        className="w-full mt-4" 
        variant="outline" 
        onClick={onAnalyzeAnother}
      >
        Analyze Another Plant
      </Button>
    </div>
  );
};

export default DiseaseResults;
