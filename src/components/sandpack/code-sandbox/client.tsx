"use client"

import {
  SandpackCodeEditor,
  useSandpack,
  SandpackProvider,
  SandpackFiles,
} from "@codesandbox/sandpack-react"

import { useGlobalContext } from "@/components/layout/context"
import type { CodeSandboxProps } from "."
import { Prettify } from "@/types"

type CodeSandboxClientProps = Prettify<
  Omit<CodeSandboxProps, "folder" | "files" | "title" | "previewHeight"> & {
    files: SandpackFiles
    children: React.ReactNode
  }
>

export const Client = ({
  files,

  template,
  options,
  customSetup,

  children,
}: CodeSandboxClientProps) => {
  const globalContext = useGlobalContext()

  return (
    <SandpackProvider
      theme={globalContext.theme}
      className="overflow-visible!"
      template={template}
      files={files}
      customSetup={{
        ...customSetup,
        // `true` for public or third-party registries like the main npm
        //   registry or mirror registries, it bypasses browser CORS errors and
        //   optimizes loading speeds through their CDN
        // `false` for connecting to your own self-hosted private npm registry
        //   (like Verdaccio) to prevent exposing your internal server or
        //   credentials to the CodeSandbox proxy
        // npmRegistries.proxyEnabled: cause error when set to `true`
        npmRegistries: [
          {
            enabledScopes: [],
            limitToScopes: false,
            registryUrl: "https://registry.npmmirror.com",
            proxyEnabled: false,
          },
        ],
      }}
      options={{
        ...options,
        bundlerURL: "https://sandpack.lorem314.site",
        initMode: "user-visible",
        recompileMode: "immediate",
      }}
    >
      {children}
    </SandpackProvider>
  )
}
