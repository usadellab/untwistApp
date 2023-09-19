import React, { useEffect } from 'react';
// import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdbreact-ui-kit';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdbreact';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'
import "@fortawesome/fontawesome-free/css/all.min.css"

import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { width } from '@mui/system';

const Footer = () => {
  useEffect(() => {
    // Import necessary MDBReact stylesheets dynamically
    import('mdb-react-ui-kit/dist/css/mdb.min.css');
    import('@fortawesome/fontawesome-free/css/all.min.css');
  }, []);

  const socialIcons = [
    { icon: 'linkedin', href: 'https://www.linkedin.com/company/untwist/'  },
    { icon: 'github', href: 'https://github.com/usadellab/untwistApp' },
  ];

  return (
    <MDBFooter bgColor='light' className="text-center text-lg-start text-muted"
    style={{ padding: '20px', width: '100%', margin: '0' }}
    >
      
      <section className='d-flex justify-content-center justify-content-lg-between p-4 border-bottom'>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div>
          {socialIcons.map((socialIcon, index) => (
            <a key={index} href={socialIcon.href} target="_blank" className='me-4 text-reset'>
              <MDBIcon color='secondary' fab icon={socialIcon.icon} />
            </a>
          ))}
        </div>
      </section>

      <section>
        <MDBContainer className='text-center text-md-start mt-2' >
          <MDBRow className='mt-3'>
            <MDBCol  md="3" lg="4" xl="3" className='mx-auto mb-4' >
              <h6  className='text-uppercase fw-bold mb-4'>
                <MDBIcon icon="gem" className="me-3" />
                IBG-4@Forschungszentrum Jülich GmbH
              </h6>
              <p>
                Forschungszentrum Jülich is a member of the Helmholtz Association with research focus on a digitized society, a climate-friendly energy system, and a resource-efficient economy.
                At IB4 we aim at creating, editing, understanding and sharing of complex data: bioinformatics for high-dimensional data and molecular processes in life sciences and bioeconomy.
              </p>
            </MDBCol>

            <MDBCol md='2' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Other Tools</h6>
              <p>
                <a href='https://www.plabipd.de/mercator_main.html' target="_blank" className='me4 me4 text-reset'>
                  Mercator
                </a>
              </p>
              <p>
                <a href='https://www.plabipd.de/mapman_main.html'  target="_blank" className='me4 me4 text-reset'>
                  MapMan
                </a>
              </p>
              <p>
                <a href='https://usadellab.github.io/GeneExpressionPlots/#/plots' target="_blank" className='me4 me4 text-reset'>
                  GXP
                </a>
              </p>
            </MDBCol>

            <MDBCol md='3' lg='2' xl='2' className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Useful links</h6>
              <p>
                <a href='https://www.fz-juelich.de/en/ibg/ibg-4' target="_blank" className='me4 me4 text-reset'>
                  Home Page
                </a>
              </p>
              <p>
                <a href='https://www.plabipd.de/query_view.ep' className='me4 text-reset' target="_blank" >Plabipd database
                </a>
              </p>
              <p className='me4 text-reset'>Plant Genomes</p>
              <ol>
                <li>
                  <a href='https://www.plabipd.de/project_solanum/solanum_main.html' target="_blank">
                    Solanum pennellii
                  </a>
                </li>
                <li>
                  <a href='https://www.plabipd.de/project_cuscuta2/start.ep' target="_blank" >
                    Cuscuta campestris
                  </a>
                </li>
              </ol>
              <p>
                <a href='#!' className='me4 text-reset'>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md='4' lg='3' xl='3' className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4'>Contact</h6>
              <p>
                <MDBIcon color='secondary' icon='home' className='me-2' />
                Wilhelm-Johnen-Straße 52428 Jülich, Germany
              </p>
              <p>
                <MDBIcon color='secondary' icon='envelope' className='me-3' />
                a.haleem [at] fz-juelich.de
              </p>
              <p>
                <MDBIcon color='secondary' icon='phone' className='me-3' /> + 49 234 567 88
              </p>
              <p>
                <MDBIcon color='secondary' icon='print' className='me-3' /> + 49 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2023 All rights reserved:
        <a className='me4 text-reset fw-bold' href='https://mdbootstrap.com/'>
          ibg4@fz-juelich.de
        </a>
      </div>
    </MDBFooter>
  );
}


const styles = {
  bgDark : {
    width: '100%',
    padding: '20px',  /* Adjust padding as needed */
    margin: '0'
  }
}
export default Footer;
