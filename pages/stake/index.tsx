import { Flex, Text } from "@chakra-ui/react"
import React, { useEffect, useState } from "react"
import DisplayNfts from "../../components/DisplayNfts"
const Page = () => {
  return (
    <Flex
      alignContent="center"
      justifyContent="center"
      width="100%"
      backgroundColor="gray.800"
      minHeight="100vh"
    >
      <DisplayNfts />
    </Flex>
  )
}

export default Page
