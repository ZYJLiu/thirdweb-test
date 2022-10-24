import { Flex } from "@chakra-ui/react"
import React from "react"
import Token from "../../components/Token"
const Page = () => {
  return (
    <Flex
      alignContent="center"
      justifyContent="center"
      width="100%"
      backgroundColor="gray.800"
      minHeight="100vh"
    >
      <Token />
    </Flex>
  )
}

export default Page
