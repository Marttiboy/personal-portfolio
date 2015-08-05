var React 				= require('react');
var Reflux = require('reflux');

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var _ 				 		= require('lodash');
var classnames 		= require('classnames');
var $ 				 		= require('jquery');
var Helmet 				= require('react-helmet');

// Config
var Config = require('../../app.config');

module.exports = React.createClass({

	shouldComponentUpdate: function(nextProps, nextState) {
		console.log("SHOULD PAGESTYLES UPDATE? " + !_.isEqual(nextProps, this.props));
		return !_.isEqual(nextProps, this.props);
	},

	// Using jquery animation etc here.
	componentDidMount: function() {
		var big_title = $(React.findDOMNode(this.refs.big_title));
		var content = $(".gr.animation");
		var SApp = this.props.AppStore;
		var data = this.props.data;

		// Do animations here for specific custom pages..
		setTimeout(function() { // Small delay because of browser support..
			$(big_title).addClass("loaded").delay(400).show(function() {
				$(content).addClass("loaded");
			});


			// If Home
			if(!_.isEmpty(data.style) && data.style === "index") {
				var pci1 = $(".index .main_content .personalcounter_item_1"),
					pci2 = $(".index .main_content .personalcounter_item_2"),
					pci3 = $(".index .main_content .personalcounter_item_3"),
					pci4 = $(".index .main_content .personalcounter_item_4"),
					index_bottom = $(".index > .body > .bottom");

				if(SApp.classes.isMobile) {
					$(index_bottom).addClass("loaded");
					$(pci1).addClass("loaded spinner");
					$(pci2).addClass("loaded spinner");
					$(pci3).addClass("loaded spinner");
					$(pci4).addClass("loaded spinner");
				} else {
					$(pci1).addClass("loaded spinner").delay(500).show(function() {
						$(pci2).addClass("loaded spinner").delay(400).show(function() {
							$(pci3).addClass("loaded spinner").delay(400).show(function() {
								$(pci4).addClass("loaded spinner").delay(1400).show(function() {
									$(index_bottom).addClass("loaded");
									$(pci1).addClass("perspective");
									$(pci2).addClass("perspective");
									$(pci3).addClass("perspective");
									$(pci4).addClass("perspective");
								});
							});
						});
					});
				}
			}
		}.bind(this), 150);
	},

	styles: function() {
		var data             = this.props.data;

		data.title           = _.isEmpty(data.title_alt) ? data.title : data.title_alt;

		var title 	         = data.showTitle ? (<h1 className="big-title" ref="big_title">{data.title}</h1>) : false;
		var body 		      = !_.isEmpty(data.body) ? (<div className="body" dangerouslySetInnerHTML={{__html: data.body}}></div>) : false;
		var style 	         = !_.isEmpty(data.style) ? data.style : false;
		var template         = [];

		var metaTitle        = !_.isEmpty(data.meta_title)       ? data.meta_title : data.title;
		var metaDescription  = !_.isEmpty(data.meta_description) ? data.meta_description : "";
		var metaRelAuthor    = !_.isEmpty(data.meta_rel_author)  ? data.meta_rel_author : "";
		var ogImage          = !_.isEmpty(data.og_image)  ? data.og_image : {src: "http://api.saarman.net/sites/default/files/slogo.jpg"};
		var ogType           = !_.isEmpty(data.og_type)  ? data.og_type : "article";

		var metaData = {
			title: "Mart Saarman | " + metaTitle,
			description: metaDescription
		};

		// Style: Default
		if (!style || style === "default") {
			template = (
				<div className={"gwrapper text-style__default " + _.kebabCase(data.path)}>
					{title}
					<section className="gr animation">
						{body}
					</section>
				</div>
			)
		}

		if (!style || style === "empty") {
			template = (
				<div className={"gwrapper text-style__default " + _.kebabCase(data.path)}>
					{title}
					<section className="gr animation">
						<section className="gc g12">
							<div className="default">
								{body}
							</div>
						</section>
					</section>
				</div>
			)
		}

		// Style: Index
		if (style === "index") {
			template = (
				<div className={classnames([style, "gwrapper"])}>
					{title}
					{body}
				</div>
			)
		}

		return (
			<Helmet
				title = {metaData.title}
				meta={[
					{"name": "description", "content": metaData.description},
					{"property": "og:title", "content": metaTitle},
					{"property": "og:description", "content": metaDescription},
					{"property": "og:image", "content": ogImage.src},
					{"property": "og:type", "content": ogType}
				]}
			   link={[
			      {"rel": "author", "href": metaRelAuthor}
			   ]}
				>
				{template}
			</Helmet>
		);

	},

	render: function() {
		return (this.styles());
	}
});