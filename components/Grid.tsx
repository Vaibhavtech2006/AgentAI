import React from 'react'
import { BentoGrid, BentoGridItem } from './ui/BentoGrid'
import { gridItems } from '@/data'
import { ContainerScroll } from "../components/ui/container-scroll-animation"

const Grid = () => {
  return (
    <section id="about">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Explore Our Features
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
              Each one crafted with precision & purpose.
            </p>
          </>
        }
      >
        <BentoGrid>
          {gridItems.map(
            ({
              id,
              title,
              description,
              className,
              img,
              imgClassName,
              titleClassName,
              spareImg
            }) => (
              <BentoGridItem
                key={id}
                id={id}
                title={title}
                description={description}
                className={className}
                img={img}
                imgClassName={imgClassName}
                titleClassName={titleClassName}
                spareImg={spareImg}
              />
            )
          )}
        </BentoGrid>
      </ContainerScroll>
    </section>
  )
}

export default Grid
