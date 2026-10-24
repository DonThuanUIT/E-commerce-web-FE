import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Star } from 'lucide-react';
import type { ProductDetail } from '../types/product';

interface ProductAccordionProps {
  product: ProductDetail;
}

/**
 * Editorial Collapsible Accordion for Product Details, Materials, and Reviews.
 */
export const ProductAccordion: React.FC<ProductAccordionProps> = ({
  product,
}) => {
  const [openSection, setOpenSection] = useState<string | null>('design');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="divide-y divide-neutral-200 border-t border-b border-neutral-200">
      {/* 1. Design & Silhouette */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('design')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Design & Silhouette</span>
          {openSection === 'design' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'design' && (
          <div className="space-y-3 pb-5 text-xs leading-relaxed text-neutral-600">
            <p>
              {product.description ||
                'Engineered according to modern tailoring standards, combining sharp proportions with all-day comfort.'}
            </p>
            <ul className="list-inside list-disc space-y-1 text-neutral-700">
              <li>Ribbed collar and cuffs with shape-retention finishing</li>
              <li>
                Reinforced double-stitch seams matching export luxury standards
              </li>
              <li>
                Versatile styling for business casual, travel, and leisure wear
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* 2. Materials & Composition */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('materials')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Materials & Composition</span>
          {openSection === 'materials' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'materials' && (
          <div className="space-y-2 pb-5 text-xs leading-relaxed text-neutral-600">
            <p>
              <strong>Fabric Composition:</strong>{' '}
              {product.material || '100% Long-staple cotton blended with elastane'}
            </p>
            <p>
              <strong>Care Instructions:</strong> Machine wash cold on delicate
              cycle (under 30°C). Do not bleach. Cool iron if needed.
            </p>
          </div>
        )}
      </div>

      {/* 3. Customer Reviews */}
      <div>
        <button
          type="button"
          onClick={() => toggleSection('reviews')}
          className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold tracking-wide text-neutral-900 uppercase"
        >
          <span>Client Reviews ({product.reviews.length})</span>
          {openSection === 'reviews' ? (
            <ChevronUp className="h-4 w-4 text-neutral-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-neutral-500" />
          )}
        </button>

        {openSection === 'reviews' && (
          <div className="space-y-4 pb-5">
            {product.reviews.length === 0 ? (
              <p className="text-xs text-neutral-500">
                No client reviews available for this piece yet.
              </p>
            ) : (
              product.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="space-y-1.5 rounded-md bg-neutral-50 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-neutral-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {new Date(rev.createdAt).toLocaleDateString('en-US')}
                    </span>
                  </div>
                  <p className="text-neutral-800">{rev.comment}</p>
                  <p className="text-[10px] font-medium text-emerald-600">
                    ✓ Verified Purchase
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
