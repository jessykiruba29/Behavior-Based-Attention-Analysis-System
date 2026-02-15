import { forwardRef } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import type { NavLinkProps } from "react-router-dom";

import { cn } from "../lib/utils";
import type { ElementRef, ComponentPropsWithoutRef } from "react";

type RouterNavLinkRef = ElementRef<typeof RouterNavLink>;

interface NavLinkCompatProps
  extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<RouterNavLinkRef, NavLinkCompatProps>(
  (
    { className, activeClassName, pendingClassName, to, ...props },
    ref
  ) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }: { isActive: boolean; isPending: boolean }) =>
  cn(
    className,
    isActive && activeClassName,
    isPending && pendingClassName
  )
}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
