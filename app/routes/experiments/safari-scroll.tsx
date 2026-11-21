import React from "react";
import { ExperimentsPage } from "~/components/layout/ExperimentsPage";
import {
  motion,
  MotionValue,
  transform,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiShare, FiCopy } from "react-icons/fi";
import { HiOutlineBookOpen } from "react-icons/hi";
import { FaUndo } from "react-icons/fa";
import { cn } from "~/lib/cn";

function useScrollOffset(ref: React.RefObject<HTMLElement>) {
  const lastScrollTop = React.useRef(0);
  const scrollOffset = useMotionValue(0);

  React.useEffect(() => {
    if (!ref.current) return;
    const wrapper = ref.current;

    let timeout = null;
    const handleScroll = () => {
      clearTimeout(timeout);

      const scrollTop = wrapper.scrollTop;
      const offset = scrollTop - lastScrollTop.current;
      lastScrollTop.current = scrollTop;
      scrollOffset.set(scrollOffset.get() + offset);

      timeout = setTimeout(() => {
        scrollOffset.set(0);
      }, 400);
    };

    wrapper.addEventListener("scroll", handleScroll);
    return () => {
      wrapper.removeEventListener("scroll", handleScroll);
      clearTimeout(timeout);
    };
  }, [ref, scrollOffset]);

  return scrollOffset;
}

const MAX_OFFSET = 50;

export default function SafariScrollPage() {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(true);
  const scrollOffset = useScrollOffset(wrapperRef);

  React.useEffect(() => {
    scrollOffset.on("change", (v) => {
      if (v > MAX_OFFSET) setOpen(false);
      if (v < -MAX_OFFSET) setOpen(true);
    });
  }, [scrollOffset]);

  return (
    <ExperimentsPage page="safari-scroll">
      <motion.div
        className="relative mx-auto h-[900px] w-[500px] overflow-y-auto rounded-[16px] border border-gray6 bg-gray1 text-[1.25rem]"
        ref={wrapperRef}
      >
        <div>
          <Article />
        </div>
        <div className="sticky bottom-0 h-[150px] w-full overflow-hidden">
          <Navbar open={open} scrollOffset={scrollOffset} />
        </div>
      </motion.div>
    </ExperimentsPage>
  );
}

const Navbar = ({
  open,
  scrollOffset,
}: {
  open: boolean;
  scrollOffset: MotionValue<number>;
}) => {
  const yOffset = useTransform(scrollOffset, (offset) => {
    if (open) {
      return transform(offset, [0, MAX_OFFSET], [0, 20]);
    }
    return transform(offset, [-MAX_OFFSET, 0], [60, 80]);
  });
  const y = useSpring(yOffset, {
    damping: 30,
    stiffness: 300,
  });
  return (
    <motion.div
      className="rounded-b-[16px] border-t border-gray3 bg-gray2 p-6 pt-4 pb-10"
      style={{ y }}
    >
      <motion.div
        className="flex items-center rounded-[8px] bg-(--background) px-4 py-2 shadow-[0_25px_50px_-12px_rgb(0_0_0/var(--shadow-opacity))]"
        animate={
          {
            "--shadow-opacity": open ? 0.25 : 0,
            "--background": open ? "var(--color-gray3)" : "var(--color-gray2)",
          } as any
        }
      >
        <motion.div
          className="w-full text-center"
          animate={{ fontSize: open ? "1em" : "0.75em" }}
        >
          nan.fyi
        </motion.div>
        <Icon animate={{ opacity: open ? 1 : 0 }}>
          <FaUndo size="0.9em" />
        </Icon>
      </motion.div>
      <div className="mt-6 flex items-center justify-between text-[1.5rem]">
        <Icon>
          <FiChevronLeft />
        </Icon>
        <Icon>
          <FiChevronRight />
        </Icon>
        <Icon>
          <FiShare />
        </Icon>
        <Icon>
          <HiOutlineBookOpen size="1.2em" />
        </Icon>
        <Icon>
          <FiCopy />
        </Icon>
      </div>
    </motion.div>
  );
};

const Article = () => {
  return (
    <div className="flex flex-col gap-8 p-12 [&_p]:mt-6 [&_p:first-of-type]:mt-12">
      <h1 className="font-bold leading-none">
        Remaking Safari's Bottom Nav in Framer Motion
      </h1>
      <SkeletonText lines={6} className="mt-4" />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
      <SkeletonText lines={6} />
    </div>
  );
};

const SkeletonText = ({
  lines,
  className,
}: {
  lines: number;
  className?: string;
}) => {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-[1.2em] bg-gray2",
            i === lines - 1 ? "w-1/2" : "w-full",
            i === 0 ? "mt-0" : "mt-2",
          )}
        />
      ))}
    </div>
  );
};

const Icon = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof motion.div>) => (
  <motion.div
    className={cn("flex items-center justify-center", className)}
    {...props}
  />
);
