"use client";

import { motion } from "motion/react";
import { Fragment, useState } from "react";
import { Wide } from "~/components/mdx/Wide";
import { useActiveIndex } from "~/components/mdx/scroll-group";
import { TRANSITIONS } from "~/lib/transitions";
import { Figure } from "../../_common/figure";

const suffixServers = [
  {
    suffix: ".com",
    domains: [
      { domain: "google.com", ipAddress: "142.250.190.14" },
      { domain: "amazon.com", ipAddress: "205.251.242.103" },
      { domain: "facebook.com", ipAddress: "157.240.241.35" },
      { domain: "youtube.com", ipAddress: "142.250.190.142" },
      { domain: "twitter.com", ipAddress: "104.244.42.1" },
    ],
  },
  {
    suffix: ".fyi",
    domains: [
      { domain: "ai.fyi", ipAddress: "192.241.206.21" },
      { domain: "news.fyi", ipAddress: "107.170.151.13" },
      { domain: "nan.fyi", ipAddress: "138.197.66.139" },
      { domain: "tech.fyi", ipAddress: "74.208.236.101" },
      { domain: "stats.fyi", ipAddress: "164.92.99.217" },
    ],
  },
  {
    suffix: ".net",
    domains: [
      { domain: "php.net", ipAddress: "151.101.2.175" },
      { domain: "battle.net", ipAddress: "137.221.106.104" },
      { domain: "adobe.net", ipAddress: "192.150.16.117" },
      { domain: "att.net", ipAddress: "144.160.155.43" },
      { domain: "verizon.net", ipAddress: "192.76.85.245" },
    ],
  },
  {
    suffix: ".org",
    domains: [
      { domain: "wikipedia.org", ipAddress: "208.80.154.224" },
      { domain: "openai.org", ipAddress: "104.20.22.46" },
      { domain: "mozilla.org", ipAddress: "44.236.72.64" },
      { domain: "archive.org", ipAddress: "207.241.224.2" },
      { domain: "redcross.org", ipAddress: "104.18.204.74" },
    ],
  },
  {
    suffix: ".edu",
    domains: [
      { domain: "harvard.edu", ipAddress: "34.232.216.205" },
      { domain: "mit.edu", ipAddress: "23.70.253.238" },
      { domain: "stanford.edu", ipAddress: "171.67.215.200" },
      { domain: "berkeley.edu", ipAddress: "169.229.216.200" },
      { domain: "yale.edu", ipAddress: "130.132.51.8" },
      { domain: "columbia.edu", ipAddress: "128.59.105.24" },
      { domain: "princeton.edu", ipAddress: "140.180.223.22" },
      { domain: "cornell.edu", ipAddress: "132.236.204.29" },
      { domain: "ucla.edu", ipAddress: "169.232.33.135" },
      { domain: "uchicago.edu", ipAddress: "128.135.13.207" },
    ],
  },
  {
    suffix: ".gov",
    domains: [
      { domain: "usa.gov", ipAddress: "23.22.13.108" },
      { domain: "nasa.gov", ipAddress: "192.0.66.208" },
      { domain: "whitehouse.gov", ipAddress: "104.109.178.94" },
      { domain: "irs.gov", ipAddress: "152.216.7.110" },
      { domain: "cia.gov", ipAddress: "104.107.33.173" },
      { domain: "epa.gov", ipAddress: "134.67.21.34" },
      { domain: "nih.gov", ipAddress: "156.40.212.203" },
      { domain: "loc.gov", ipAddress: "140.147.249.9" },
      { domain: "usps.gov", ipAddress: "56.0.134.100" },
      { domain: "ssa.gov", ipAddress: "137.200.4.19" },
    ],
  },
  {
    suffix: ".io",
    domains: [
      { domain: "github.io", ipAddress: "185.199.108.153" },
      { domain: "npm.io", ipAddress: "3.208.48.154" },
      { domain: "exercism.io", ipAddress: "104.21.25.47" },
      { domain: "vercel.io", ipAddress: "76.76.21.21" },
      { domain: "zeit.io", ipAddress: "54.192.151.3" },
      { domain: "web3.io", ipAddress: "18.204.131.85" },
      { domain: "duckduckgo.io", ipAddress: "20.191.45.2" },
      { domain: "codesandbox.io", ipAddress: "35.201.97.85" },
      { domain: "glitch.io", ipAddress: "95.216.73.221" },
      { domain: "repl.io", ipAddress: "35.244.233.92" },
    ],
  },
];

export function Computer() {
  return (
    <div className="w-[60px] h-14 mx-auto flex flex-col">
      <div className="bg-gray4 pb-0.5 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10  grow relative">
        <div className="h-full flex items-center bg-gray4 rounded-lg border-4 border-gray1" />
      </div>
      <div className="h-1.5 w-4 bg-gray8 mx-auto" />
      <div className="h-2 w-2/3 mx-auto bg-gray1 shadow-md shadow-black/7 rounded-sm ring-1 ring-black/10" />
    </div>
  );
}

export function Router() {
  return (
    <div className="w-[60px] h-14 mx-auto flex flex-col">
      <div className="h-1/2 flex justify-between px-2">
        <div className="h-full w-1 bg-gray1 shadow-md shadow-black/7 rounded-t ring-1 ring-black/10" />
        <div className="h-full w-1 bg-gray1 shadow-md shadow-black/7 rounded-t ring-1 ring-black/10" />
      </div>
      <div className="bg-gray4 pb-0.5 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10 h-1/2 -translate-y-1">
        <div className="h-full flex items-center bg-gray1 rounded-lg px-2 gap-0.5">
          <div className="size-2.5 rounded-full bg-blue-500 border-2 border-blue-200" />
          <div className="size-1.5 rounded-full bg-gray6 ml-auto" />
          <div className="size-1.5 rounded-full bg-gray6" />
        </div>
      </div>
    </div>
  );
}

export function Server() {
  return (
    <div className="w-[60px] mx-auto bg-gray1 shadow-md shadow-black/7 rounded-lg ring-1 ring-black/10">
      <div className="h-7 flex items-center px-2 gap-1 border-b border-black/10">
        <div className="size-2.5 rounded-full bg-blue-500 border-2 border-blue-200" />
        <div className="h-2.5 grow grid grid-rows-2 gap-px">
          <div className="bg-gray6 rounded-[2px]" />
          <div className="bg-gray6 rounded-[2px]" />
        </div>
      </div>
      <div className="bg-gray4 pb-0.5 rounded-b-lg overflow-hidden">
        <div className="h-7 flex items-center px-2 gap-1 bg-gray1 rounded-b-lg -mt-px">
          <div className="size-2.5 rounded-full bg-gray6" />
          <div className="h-2.5 grow grid grid-rows-2 gap-px">
            <div className="bg-gray6 rounded-[2px]" />
            <div className="bg-gray6 rounded-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainList({
  suffix,
  domains,
}: {
  suffix: string;
  domains: { domain: string; ipAddress: string }[];
}) {
  return (
    <div className="relative">
      <p className="bg-gray3 w-fit rounded-t-md border border-black/15 border-b-0 ml-3 px-1.5 absolute bottom-full -mb-px">
        {suffix}
      </p>
      <div className="p-1.5 bg-gray3 rounded-xl border border-black/15">
        <ul className="grid grid-cols-[auto_auto] ring-1 rounded-md ring-black/10 shadow-md overflow-hidden bg-gray2">
          {domains.map((domain) => {
            const [name, suffix] = domain.domain.split(".");
            return (
              <Fragment key={domain.domain}>
                <p className="border-b border-r h-9 flex items-center px-3 [&:nth-last-child(2)]:border-b-0">
                  <span>{name}</span>
                  <span className="text-gray10">.{suffix}</span>
                </p>
                <p className="font-mono text-sm border-b border-r flex items-center px-3 [&:nth-child(even)]:border-r-0 last:border-b-0">
                  {domain.ipAddress}
                </p>
              </Fragment>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export function DNSScrollVisual() {
  const [width, setWidth] = useState(0);
  const index = useActiveIndex();

  const boxWidth = (width - 24) / 2;

  return (
    <div
      ref={(el) => setWidth(el?.getBoundingClientRect().width)}
      className="h-[500px] flex items-center"
    >
      <div className="grid grid-cols-2 gap-x-6">
        {index > 0 && (
          <>
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 32, opacity: 0 }}
              transition={TRANSITIONS.slow}
            >
              <Server />
            </motion.div>
            <motion.div
              animate={{ y: 0, opacity: 1 }}
              initial={{ y: 32, opacity: 0 }}
              transition={TRANSITIONS.slow}
            >
              <Server />
            </motion.div>
            <div className="col-span-2 text-gray8">
              <svg
                viewBox={`0 0 ${width} 120`}
                aria-hidden="true"
                width={width}
                height="120"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
              >
                <g transform={`translate(${boxWidth / 2}, 0)`}>
                  <motion.line
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{
                      ...TRANSITIONS.slow,
                      delay: 0.2,
                    }}
                    y2="120"
                  />
                  <motion.path
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{
                      ...TRANSITIONS.slow,
                      delay: 0.3,
                    }}
                    d={`M0 0 c0 90 ${boxWidth + 24} 30 ${boxWidth + 24} 120`}
                  />
                </g>
                <g transform={`translate(${boxWidth + 24 + boxWidth / 2}, 0)`}>
                  <motion.line
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{
                      ...TRANSITIONS.slow,
                      delay: 0.4,
                    }}
                    y2="120"
                  />
                  <motion.path
                    animate={{ pathLength: 1 }}
                    initial={{ pathLength: 0 }}
                    transition={{
                      ...TRANSITIONS.slow,
                      delay: 0.5,
                    }}
                    d={`M0 0 c0 90 ${-boxWidth - 24} 30 ${-boxWidth - 24} 120`}
                  />
                </g>
              </svg>
              <div className="grid grid-cols-[1fr_24px_1fr]">
                <div className="w-3 bg-current h-1.5 rounded-t-sm mx-auto" />
                <div className="w-3 bg-current h-1.5 rounded-t-sm mx-auto col-start-3" />
              </div>
            </div>
          </>
        )}
        <motion.div layout="position" transition={TRANSITIONS.slow}>
          <DomainList suffix=".com" domains={suffixServers[0].domains} />
        </motion.div>
        <motion.div layout="position" transition={TRANSITIONS.slow}>
          <DomainList suffix=".fyi" domains={suffixServers[1].domains} />
        </motion.div>
      </div>
    </div>
  );
}

export function DNSVisual() {
  return (
    <Wide>
      <Figure className="h-[300px] grid grid-cols-2 divide-x divide-gray8">
        <div className="flex justify-center items-center">
          <p className="text-2xl font-medium">nan.fyi.</p>
        </div>
        <div></div>
      </Figure>
    </Wide>
  );
}
