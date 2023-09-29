import * as React from "react";
import { styled } from "@mui/material/styles";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));

export function FAQs() {
  const [expanded, setExpanded] = React.useState("panel1");

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Grid sx={{ mt: 2, mr: 2 }}>
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
          <Typography>What is untwist ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          The UNTWIST project operates on the fundamental principle that studying stress adaptation mechanisms in camelina, a naturally resilient European oilseed crop with minimal breeding, can unveil effective stress coping strategies. These strategies, once identified, can then be leveraged to enhance yield stability in camelina and other crops, especially in the face of challenging and shifting environmental conditions.

            UNTWIST is a unique, highly interdisciplinary consortium of four
            research organizations / institutes, one university, one commercial
            SME partner and two non-profit SMEs. These include:
            <Grid sx={{mt:2, marginBottom:2}}>
            <ol >
              <li>
                  AIT AUSTRIAN INSTITUTE OF TECHNOLOGY GMBH (AIT), AUSTRIA
              </li>
              <li>
                  INSTITUT NATIONAL DE LA RECHERCHE AGRONOMIQUE (INRAE), FRANCE
              </li>
              <li>
                ROTHAMSTED RESEARCH (RRES), UNITED KINGDOM 
              </li>
              <li>
                FORSCHUNGSZENTRUM JÜLICH GMBH (FZJ) 
              </li>
              <li>
                UNIVERSITY OF BOLOGNA (UNIBO), ITALY
              </li>
              <li>
                CAMELINA COMPANY ESPAÑA S.L. (CCE), SPAIN 
              </li>
              <li>
                INICIATIVAS INNOVADORAS (INI), SPAIN 
              </li>
            </ol>
            </Grid>


            <div>
            <Typography>For further details refer to <span></span>

            <a href="https://www.untwist.eu/" target="_blank">
               https://www.untwist.eu/
            </a>

            </Typography>
            

            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel2"}
        onChange={handleChange("panel2")}
      >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
          <Typography>What is IBG4 ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <p>
              The institute Bioinformatics (IBG-4) is locate at the
              Forschungszentrum Juelich, Germany and develops methods and
              algorithms, aiming for a fundamental understanding of
              high-dimensional data and processes in life sciences and
              bioeconomy and for an understanding and a prediction of the
              biological function of moelcules/enzymes on the basis of their
              stucture for optimizsation for industrial and pharmaceutical
              utilisation. Bioinformatics at Forschungszentrum Jülich play a
              leading role on national and international level in the area of{" "}
              <b>omics-/data-based bioinformati</b>
              <strong>cs </strong>focussing on plant data management, novel
              methods for genome analysis and the field of integration,
              interpretation and visualisation of high-dimensional omics data in
              bioeconomy and in the area of{" "}
              <strong>structure-based bioinformatics</strong> with a focus on
              the elucidation, modelling and simulation of the dynamics and
              interactions of bio-molecules. IBG-4 focusses on knowledge
              management, data integration, classical bioinformatics and machine
              learning, especially for the prediction of phenotypes and
              structures and dynamics of enzymes.
            </p>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel8"}
        onChange={handleChange("panel8")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How I can explore the phenotypic data? </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <p>The module, VisPheno, serves as a comprehensive repository for all collected phenotypic data acquired throughout the project lifecycle. Its primary objective is to furnish users with an in-depth understanding of the distribution of the targeted phenotype. This is accomplished through the utilization of various plot types.</p>

          <p>For instance, to obtain a holistic view of the phenotype, users can generate a straightforward bar plot, providing a visual representation of raw phenotypic data across the entire population. Alternatively, users have the capability to summarize data by extracting key statistical metrics such as minimum, maximum, median, and quartiles, employing box plots to identify potential outliers.</p>

          <p>Furthermore, users can conduct comparative analyses between different phenotypes by contrasting their distributions. This is facilitated by the utilization of violin plots and raincloud plots. In addition, the software empowers users to detect potential confounding factors through the implementation of linReg plots.</p>

          <p>In addition to visualization capabilities, the component offers robust data filtering options, enabling users to construct intricate queries using mathematical and logical operators. Notably, the resulting plot dynamically adapts to reflect these changes, ensuring that users receive real-time feedback and insights.</p>
          </Typography>
        </AccordionDetails>
      </Accordion>


      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How does GWAS analysis implemented ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>

            <p>
            This component allows for the conducting GWAS analysis on any phenotypic or metabolic traits collected during the project. 
            To this end, stable version of Plink 1.07 (http://pngu.mgh.harvard.edu/purcell/plink),
            a C/C++ command line program for population genetics analysis is compiled to webassembly module which enables highly scalable in-browser GWAS analysis. 
            This tool enables automated association testing for quantitative  as well qualitative response variable using plink commands (--assoc, --qassoc) made available by plink webassembly module. 
            Additionally, fitting linear regression model implement in plink (--linear), 
            this tool allows one to perform GWAS analysis accounting for population structure in the data using first two principle components (PC1 and PC2) as covariants,
            computed using the same genotypic data being used for GWAS analysis.  
            Following the GWAS analysis, our tool employs JavaScript to seamlessly manage the results.
            Multiple downstream analysis and visualization components operate in parallel, generating essential outputs, including Manhattan plots, QQ-plots, structural annotations, 
            and functional gene annotations (mercator4.5) of the genome. This comprehensive suite of functionalities empowers researchers to explore and interpret GWAS results with precision and efficiency.

            </p>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How the untwistApp performs MDS analysis ?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <p>The Multidimensional Scaling (MDS) analysis is seamlessly integrated into the Plink WebAssembly module, facilitating a streamlined workflow for this analytical task. To compute MDS coordinates, the tool is invoked using Plink with a set of specific flags.</p>
          <p>The MDS analysis is initiated with the --read-genome, --cluster, --ppc, and --mds-plot flags. This calculates the first two coordinates of the MDS representation.</p>
          <p>Subsequently, the resulting MDS data is seamlessly integrated with Plotly  to create an illustrative MDS plot, offering a visually intuitive representation of the multidimensional relationships within the data.</p>
          <p>This integrated approach  provides users with a robust and insightful means of exploring multidimensional genetic data.</p>
          <p>Furthermore, the resulting plot also shows the respective clusters colored differently based on genome-wide IBS </p>
          </Typography>
        </AccordionDetails>
      </Accordion>

      {/* <Accordion
        expanded={expanded === "panel5"}
        onChange={handleChange("panel5")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>How long does it take to perform the analyses?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>....</Typography>
        </AccordionDetails>
      </Accordion> */}

      <Accordion
        expanded={expanded === "panel6"}
        onChange={handleChange("panel6")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>IMPRESSUM INFORMATION</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div
              className="xbox"
              style={{
                columnCount: 2,
                columnGap: 40,
                padding: 40,
                whiteSpace: "normal",
              }}
            >
              <p className="headbox" style={{ verticalAlign: "middle" }}>
                Impressum information
              </p>
              Forschungszentrum Jülich GmbH
              <br />
              IBG-4 - Bioinformatics
              <br />
              Wilhelm-Johnen-Straße
              <br />
              52428 Jülich
              <br />
              Contact:{" "}
              <a
                href="mailto:plabipd@fz-juelich.de"
                title="plabipd@fz-juelich.de"
              >
                <span>plabipd@fz-juelich.de</span>
              </a>
              <br />
              <br />
              HHU Düsseldorf University
              <br />
              Institute of Biological Data Science
              <br />
              Universitätsstr. 1
              <br />
              40225 Düsseldorf
              <br />
              <br />
              <h3>Website hosting</h3>
              <p>
                Forschungszentrum Jülich GmbH
                <br />
                Wilhelm-Johnen-Straße
                <br />
                52428 Jülich
              </p>
              <p>
                Entered in the Commercial Register of the District Court of
                Düren, Germany: No. HR B 3498
                <br />
                Value Added Tax ID No. in accordance with §27a of the German VAT
                Law (Umsatzsteuergesetz): DE 122624631
                <br />
                Tax No.: 213/5700/0033
              </p>
              <h4>Board of Directors</h4>
              <p>
                Prof. Dr.-Ing. Wolfgang Marquardt (Chairman of the Board of
                Directors)
                <br />
                Karsten Beneke (Vice-Chairman)
                <br />
                Dr. Ir. Pieter Jansens
                <br />
                Prof. Dr. Astrid Lambrecht
                <br />
                Prof. Dr. Frauke Melchior
              </p>
              <h4>Supervisory Board</h4>
              <p>Ministerialdirektor Volker Rieke</p>
              <h4>
                Responsible in the sense of §18, Abs.2, Medienstaatsvertrag
                (MStV)
              </h4>
              Prof. Dr. Björn Usadel
              <br />
              IBG-4 - Bioinformatics
              <br />
              Forschungszentrum Jülich GmbH
              <br />
              Wilhelm-Johnen-Straße
              <br />
              52428 Jülich
              <h4>Contact</h4>
              <p>
                General inquiries: +49 2461 61-0
                <br />
                General fax no.: +49 2461 61-8100
                <br />
                General email address:{" "}
                <a href="mailto:info@fz-juelich.de" title="info@fz-juelich.de">
                  <span>info@fz-juelich.de</span>
                </a>
                <br />
                Internet:{" "}
                <a href="http://www.fz-juelich.de">http://www.fz-juelich.de</a>
              </p>
              <h4>Copyright</h4>
              <p style={{ whiteSpace: "normal" }}>
                Copyright and all other rights concerning this website are held
                by Forschungszentrum Jülich GmbH. Use of the information
                contained on the website, including excerpts, is permitted for
                educational, scientific or private purposes, provided the source
                is quoted (unless otherwise expressly stated on the respective
                website). Use for commercial purposes is not permitted unless
                explicit permission has been granted.
              </p>
              <h4>Disclaimer</h4>
              <ul>
                <li>
                  <h4>Contents of this website</h4>
                  <p style={{ whiteSpace: "normal" }}>
                    This website has been compiled with due diligence. However,
                    Forschungszentrum Jülich neither guarantees nor accepts
                    liability for the information being up-to-date, complete or
                    accurate.
                  </p>
                </li>
                <li>
                  <h4>Links to External Websites</h4>
                  <p style={{ whiteSpace: "normal" }}>
                    This website may contain links to external third-party
                    websites. These links to third party sites do not imply
                    approval of their contents. Responsibility for the content
                    of these websites lies solely with the respective provider
                    or operator of the site. Illegal contents were not
                    recognizable at the time of setting the link. We do not
                    accept any liability for the continual accessibility or
                    up-to- dateness, completeness or correctness of the contents
                    of such websites. If we become aware of any infringements of
                    the law, we will remove such links immediately.
                  </p>
                </li>
                <li>
                  <h4>Data protection</h4>
                  <p style={{ whiteSpace: "normal" }}>
                    Every time a user accesses a website hosted by
                    Forschungszentrum Jülich GmbH and every time a file is
                    requested, data connected to these processes are stored in a
                    log. These data do not contain personal information; we are
                    unable to trace which user accessed what information.
                    Personal user profiles therefore cannot be created. The data
                    that is saved will be used for statistical purposes only.
                    This information will not be disclosed to third parties.{" "}
                  </p>
                </li>
              </ul>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={expanded === "panel7"}
        onChange={handleChange("panel7")}
      >
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
          <Typography>GDPR PRIVACY NOTICE</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <div
              className="xbox"
              style={{
                columnCount: 2,
                columnGap: 40,
                padding: 40,
                whiteSpace: "normal",
              }}
            >
              <p className="headbox" style={{ verticalAlign: "middle" }}>
                GDPR privacy notice
              </p>
              <h4>PlabiPD privacy policy</h4>
              <p>
                PlabiPD would like to assure you that we are committed to
                protecting the privacy of all our users. The purpose of this
                Privacy Statement is to inform you of the data relating to you
                that we collect and use in connection with this website and the
                uses (including disclosures to third parties) we make of such
                data. We will ensure that the information you provide us with is
                kept private and confidential, and we will only use it to
                provide the services you request.
              </p>
              <h4>Requirement to provide personal data</h4>
              <p>
                You are not under a contractual or statutory obligation to
                provide us with any personal data.
              </p>
              <h4>Personal data that PlabiPD collects and processes</h4>
              <p>
                When you sign up to our website, send us an email, or
                communicate with us in any way, you are voluntarily giving us
                information which we collect. That information may include:
              </p>
              <ul>
                <li>
                  your name and contact details, including your postal address,
                  phone number and e-mail address
                </li>
                <li>
                  your user ID and password to your account on our website
                </li>
                <li>your contact preferences</li>
                <li>
                  any other information relating to you that you provide to us
                  or that we generate about you in connection with your use of
                  the website
                </li>
              </ul>
              By giving us this information, you consent to this information
              being collected. In the interest of your privacy, we only collect,
              use and retain information reasonably required for our legitimate
              interests.
              <p />
              <h4>Non-personal data that PlabiPD collects</h4>
              <p>
                In addition, when you browse our website, we may automatically
                collect information about your visit by using cookies. The
                following non-personal information may be retained about that
                visit:
              </p>
              <ul>
                <li>your device type</li>
                <li>the search engine used to access the website</li>
                <li>how you came to the website</li>
                <li>how you interacted with the website</li>
              </ul>
              Most non-personal information is collected via cookies or other
              analysis technologies. This information may be used to monitor or
              improve website performance. Information from the cookie alone
              generally will not identify you personally and we will not use
              this information in connection with any personally identifiable
              information you have provided.
              <p />
              <h4>How PlabiPD uses the collected data</h4>
              <p>
                PlabiPD uses your personal data for the following: to
                communicate with you if you choose to participate in our forum
                (optional) You have the option to
                subscribe/unsubscribe/contribute to our forum at will. to inform
                you (if you have optionally decided to choose this option) via
                email when a job your have submitted to our cluster system had
                completed. Non-personal information is aggregated for reporting
                about PlabiPD website usability, performance and effectiveness.
                It is used to improve the website usability and website content.
              </p>
              <h4>Information PlabiPD shares with third party providers</h4>
              <p>
                We don't share your personally identifiable information with any
                third party providers.
              </p>
              <h4>Keeping your information secure</h4>
              <p>
                PlabiPD is committed to protecting the information you provide.
                In particular we take steps to prevent unauthorised access or
                disclosure, to maintain data accuracy, and to ensure the
                appropriate use of the information we collect. We take
                reasonable and appropriate measures to protect Personal
                Information from loss, misuse and unauthorised access,
                disclosure, alteration and destruction, considering the risks
                involved in the processing and the nature of the personal
                information. Your personal information is contained behind
                secured networks and is only accessible by a limited number of
                persons who have special access rights to such systems, and are
                required to keep the information confidential.
              </p>
              <h4>Retention of personal data</h4>
              <p>
                We will not hold your personal data for longer than is
                necessary. We retain your personal data for as long as we need
                it for the purposes described in this Privacy Statement, or to
                comply with our obligations under applicable law.
              </p>
              <h4>Access to and accuracy of your information</h4>
              <p>
                PlabiPD strives to keep your personal information accurate. We
                provide you with access to your information when you login to
                our site, and the opportunity to change your information. To
                protect your privacy and security, we will also take reasonable
                steps to verify your identity, such as a password and user ID,
                before granting access to your data.
              </p>
              <h4>Third party websites</h4>
              <p>
                Our website includes links to other websites, whose privacy
                practices may be different from ours. If you submit personally
                identifiable information to any of those sites, your information
                is governed by their privacy policies. We encourage you to
                carefully read the privacy policy of any website you visit.
              </p>
              <h4>Individual rights</h4>
              <p>
                You have the following rights, in certain circumstances and
                subject to certain restrictions, in relation to your personal
                data: the right to access your personal data; the right to
                request the rectification and/or erasure of your personal data;
                the right to restrict the use of your personal data; the right
                to object to the processing of your personal data; where our
                processing of your personal data is based on you having provided
                consent, the right to withdraw your consent to the processing at
                any time. If you wish to exercise any of the rights set out
                above, or have comments or questions about our Privacy
                Statement, please contact us at: plabipd@fz-juelich.de
              </p>
            </div>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
}
