import React from "react";
import { shallow } from "enzyme";
import AppHeader from "../Header";
import {
	Header,
	HeaderName
} from "carbon-components-react/lib/components/UIShell";

describe("<AppHeader />", () => {
	let wrapper;

	beforeEach(() => wrapper = shallow(<AppHeader />));

	it("should render a Header", () => {
		expect(wrapper.find(Header).length).toBe(1);
	});

	it("should render a HeaderName", () => {
		expect(wrapper.find(HeaderName).length).toBe(1);
		expect(wrapper.find(HeaderName).props().href).toEqual("/");
	});
});
