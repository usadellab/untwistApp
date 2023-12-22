'use client'

import { Button } from '@mui/material'
import React from 'react'

export default function Contact() {
  return (
    <div style={{ padding: '0 8px' }} >
      <h2 className="documentFirstHeading">
        Contact &amp; Visitor information
      </h2>
      <p>
        Please find detailed descriptions on how to reach the Forschungszentrum
        Juelich here:
      </p>
      <div className="block button align left">
        <a
          href="https://www.fz-juelich.de/en/about-us/contact-visitor-information"
          target="_blank"
        >
          <Button variant="contained">How to reach us</Button>
        </a>
      </div>

      <p />
      <h2 id="b96928cf-b321-4cf3-9bc3-e9884b6e73a5">Our Address:</h2>
      <p>
        Wilhelm-Johnen-Straße
        <br />
        52428 Jülich
      </p>
      <h3 id="f4feeec4-edb8-4e16-955b-db9e9d8c5e13">Our postal address:</h3>
      <p>
        Forschungszentrum Jülich GmbH
        <br />
        IBG-4
        <br />
        [Name of contact]
        <br />
        52425 Jülich
        <br />
        Germany
      </p>
      <p>
        The institutes section IBG-4 is located in{' '}
        <strong>building 14.6y</strong> and in{' '}
        <strong>building 06.5 u+v</strong>{' '}
        <strong>(Omics-/Data-based Bioinformatics)</strong> and in{' '}
        <strong>building 05.11u </strong>(
        <strong>Structure-based Bioinformatics)</strong>.
      </p>
      <div>
        <a
          target="_blank"
          href="https://internet-live.fz-juelich.de/de/ueber-uns/kontakt/lageplan-2021-portal.pdf/@@download/file"
        >
          <figure className="figure detached center large">
            <img
              loading="lazy"
              src="https://www.fz-juelich.de/en/ibg/ibg-4/about-us/contact-visitor-information/pdf-plan-1.jpg/@@images/image"
              alt="Contact & Visitor information"
            />
            <figcaption>
              Here you find a map of the Forschungszentrum Juelich.
            </figcaption>
          </figure>
        </a>
      </div>
      <div>
        <a
          target="_blank"
          href="/en/about-us/contact-visitor-information/interactive-site-plan-of-forschungszentrum-julich"
        ></a>
      </div>
      <p />
    </div>
  )
}
