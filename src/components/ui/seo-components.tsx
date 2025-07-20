"use client";

import React from 'react';
import Script from 'next/script';
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateMedicalWebPageSchema,
  generateOrganizationSchema,
  generateWebAppSchema
} from '@/lib/seo-helper';

/**
 * Organization Schema Component
 * Renders JSON-LD structured data for organization
 */
export function OrganizationSchema() {
  const schema = generateOrganizationSchema();
  
  return (
    <Script
      id="jsonld-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * FAQ Schema Component
 * Renders JSON-LD structured data for FAQs
 */
export function FAQSchema() {
  const schema = generateFAQSchema();
  
  return (
    <Script
      id="jsonld-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * MedicalWebPage Schema Component
 * Renders JSON-LD structured data for medical web pages
 */
export function MedicalWebPageSchema({ title, description }: { title: string; description: string }) {
  const schema = generateMedicalWebPageSchema(title, description);
  
  return (
    <Script
      id="jsonld-medical-webpage"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * Breadcrumb Schema Component
 * Renders JSON-LD structured data for breadcrumb navigation
 */
export function BreadcrumbSchema({ items }: { items: {name: string, url: string}[] }) {
  const schema = generateBreadcrumbSchema(items);
  
  return (
    <Script
      id="jsonld-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * WebApp Schema Component
 * Renders JSON-LD structured data for web application
 */
export function WebAppSchema() {
  const schema = generateWebAppSchema();
  
  return (
    <Script
      id="jsonld-webapp"
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * Custom Schema Component
 * Renders custom JSON-LD structured data
 */
export function CustomSchema({ id, schema }: { id: string; schema: Record<string, any> }) {
  return (
    <Script
      id={`jsonld-${id}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

/**
 * Complete SEO Package Component
 * Bundles all common schemas in one component for easy reuse
 */
export function SEOPackage({ 
  title, 
  description,
  breadcrumbItems,
  includeFAQ = false,
  includeWebApp = true,
}: { 
  title: string; 
  description: string;
  breadcrumbItems: {name: string, url: string}[];
  includeFAQ?: boolean;
  includeWebApp?: boolean;
}) {
  return (
    <>
      <OrganizationSchema />
      <MedicalWebPageSchema title={title} description={description} />
      <BreadcrumbSchema items={breadcrumbItems} />
      {includeFAQ && <FAQSchema />}
      {includeWebApp && <WebAppSchema />}
    </>
  );
} 