import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { constants } from "../constants/Contants";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfViewer = ({ endpoint }) => {
  const authToken = localStorage.getItem(constants.tokenKey);
  const [numPages, setNumPages] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchPdf = async () => {
      try {
        const response = await fetch(constants.hostUrl + endpoint, {
          method: "GET",
          headers: {
            Authorization: `Token ${authToken}`,
          },
        });
        if (response.ok) {
          const blob = await response.blob();
          setPdfFile(URL.createObjectURL(blob));
        } else {
          throw new Error("PDF could not be fetched");
        }
      } catch (error) {
        console.error("Error fetching PDF:", error);
      }
    };

    fetchPdf();
  }, [endpoint]); // Dependency array, re-fetch if pdfName changes

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div
      className=""
      style={{
        height: "500px",
        overflow: "auto",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {pdfFile && (
        <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PdfViewer;
