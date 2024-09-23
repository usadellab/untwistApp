# This file is part of [untwistApp], copyright (C) 2024 [ataul haleem].

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.

# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import React, { useEffect } from "react";
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from "mdbreact";
import "@fortawesome/fontawesome-free/css/all.min.css";


const Footer = (props) => {

  var textColor = props.isDark ? "text-white" : "text-black"
  useEffect(() => {
    // Import necessary MDBReact stylesheets dynamically
    import("mdb-react-ui-kit/dist/css/mdb.min.css");
    import("@fortawesome/fontawesome-free/css/all.min.css");
  }, []);

  const socialIcons = [
    { icon: "linkedin", href: "https://www.linkedin.com/company/untwist/" },
    { icon: "github", href: "https://github.com/usadellab/untwistApp" },
  ];

  return (
    <MDBFooter
      bgColor="dark"
      className={`text-center text-lg-start ${textColor}`}
      style={{ padding: "20px", width: "100%", margin: "0" }}
    >
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          {socialIcons.map((socialIcon, index) => (
            <a
              key={index}
              href={socialIcon.href}
              target="_blank"
              className="me-4 text-reset"
            >
              <MDBIcon fab icon={socialIcon.icon} />
            </a>
          ))}
        </div>
      </section>

      <section>
        <MDBContainer className="text-center text-md-start mt-2">
          <MDBRow className="mt-3">

            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-2">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="gem" className="me-3" />
                UNTWIST
              </h6>
              <p>
                UNTWIST is a unique, highly interdisciplinary consortium of four
                research organizations / institutes, one university, one
                commercial SME partner and two non-profit SMEs ....
              </p>
            </MDBCol>

            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-2">
              <h6 className="text-uppercase fw-bold mb-4">Other Tools</h6>
              <p>
                <a
                  href="https://www.plabipd.de/mercator_main.html"
                  target="_blank"
                  className="me4 me4 text-reset"
                >
                  Mercator
                </a>
              </p>
              <p>
                <a
                  href="https://www.plabipd.de/mapman_main.html"
                  target="_blank"
                  className="me4 me4 text-reset"
                >
                  MapMan
                </a>
              </p>
              <p>
                <a
                  href="https://usadellab.github.io/GeneExpressionPlots/#/plots"
                  target="_blank"
                  className="me4 me4 text-reset"
                >
                  GXP
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className="mx-auto mb-2">
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <a href="https://www.plabipd.de" target="_blank">
                Plabipd 
              </a>
              <br></br>
              <a
                href="http://www.usadellab.org/cms/index.php?page=UsadelBjoern"
                target="_blank"
              >
                USADELLAB
              </a>
              
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-2">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon color="secondary" icon="home" className="me-2" />
                Wilhelm-Johnen-Straße 52428 Jülich, Germany
              </p>
              <p>
                <MDBIcon color="secondary" icon="envelope" className="me-3" />
                a.haleem [at] fz-juelich.de
              </p>
            </MDBCol>

          </MDBRow>
        </MDBContainer>
      </section>


      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
      >
        <a
          className="me-4 text-reset fw-bold"
          href="https://www.biological-data-science.hhu.de/"
          target="_blank"
        >
          © 2014-2023 Usadel lab | IBG-4, Forschungszentrum Jülich | Heinrich
          Heine University Düsseldorf
        </a>
      </div>
    </MDBFooter>
  );
};

export default Footer;
