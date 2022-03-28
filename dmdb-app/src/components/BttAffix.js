import { Affix, Button, Transition } from "@mantine/core";
import { useWindowScroll } from '@mantine/hooks';
import { ArrowUpIcon } from "@radix-ui/react-icons";

export default function BttAffix() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 10}>
        {(transitionStyles) =>
          <Button
            leftIcon={<ArrowUpIcon />}
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            color="dark"
            uppercase
          >
            Back to top
          </Button>
        }
      </Transition>
    </Affix>
  )
}