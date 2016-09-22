
(function($) {

  $.fn.multiList = function( options ){
    var that = this;
    var multiListContainer;
    var multiListNestable;
    var multiListSelect2;
    var multiListId;

    var dataSelected = [];
    var selector = this;

    var defaults = {
      orientation: 'vertical',
      itemActions: false,
      itemImage: false,
      icon: false,
      placeholder: 'Select options'
    };
    var settings = $.extend( {}, defaults, options );
    settings.orientation = settings.orientation.charAt(0).toUpperCase();
    if(settings.itemImage){
      settings.orientation = 'H';
    }

    /*
      Inicializa el selector nativo con data-multiList-id y data-order
    */

    that.initOptionsValues = function (){
      var optN = 1;
      selector.find('option').each(function( index ) {
        $(this).attr('data-multiList-id', optN);
        optN++;
      });
    }
    /*
      Genera el html necesario para el MultiList y mueve el selector dentro de esa estructura
    */
    that.createInterface = function (){
      var multiListImages = "";
      if(settings.itemImage){
        multiListImages = "multiListImages"
      }

      var multiListHtml = "";
      multiListHtml+= '<div id="'+multiListId+'" class="multiListContainer">';
        multiListHtml+= '<div class="multiListNestable '+multiListImages+' multiList'+settings.orientation+' dd"><ol class="dd-list clearfix"></ol></div>';
        multiListHtml+= '<div class="multiListSelect2"></div>';
      multiListHtml+= '</div>';

      $(this).before( multiListHtml );
      multiListContainer = $('#'+multiListId);
      multiListNestable = multiListContainer.find('.multiListNestable');
      multiListSelect2 = multiListContainer.find('.multiListSelect2');
      multiListSelect2.append( selector );

    },
    /*
      Genera un array de obj con las opciones seleccionadas
    */
    that.getSelectedValues = function( ){
      dataSelected = [];
      selector.find('option:selected').each(function( index ) {
        var data = {
          id: $( this ).attr('data-multiList-id'),
          name: $( this ).text(),
          weight: $( this ).attr('data-order'),
          value: $( this ).val()
        }
        if(settings.itemImage){
          data.image = $( this ).attr('data-image');
        }
        dataSelected.push(data);
      });
      selector.find('option').not('option:selected').attr('data-order', parseInt((dataSelected.length)+1));
      dataSelected.sort(function(a,b) { return parseInt(a.weight) - parseInt(b.weight) } );
    }
    /*
      Recibe como parametro un multiListId y devuelve un objeto con todos los datos del option
    */
    that.getMultilistItem = function( id ){
      return $.grep(dataSelected, function(e){
        return e.id == id;
      })[0];
    }
    /*
      Ejecuta y genera el html necesario para Nestable2 y por ultimo hace un Bind para desseleccionar un elemento.
    */
    that.execNestable = function( ){
      multiListNestable.find('.dd-list').html('');
      if( dataSelected.length > 0 ){
        $.each( dataSelected, function( key, elem ) {
          var nestableItem = '<li class="dd-item" data-id="'+elem.id+'">';
            nestableItem += '<div class="unselectNestable">X</div>';
            if(settings.itemActions){
              nestableItem += '<ul class="dd-multiListActions clearfix">';
                $.each(settings.itemActions, function( i, act ) {
                  nestableItem += '<li class="dd-multiList-action-'+act.id+'" data-action-id="'+act.id+'">';
                    nestableItem += act.html;
                  nestableItem += "</li>";
                });
              nestableItem += '</ul>';
            }

            nestableItem += '<div class="dd-handle">';
              nestableItem += '<div class="dd-multiListIcon">';
                if(settings.icon){
                  nestableItem += settings.icon;
                }
              nestableItem += '</div>';
              if(settings.itemImage){
                nestableItem += '<div class="multiListImage"><img class="img-responsive" src="'+elem.image+'"></div>';
              }

              nestableItem += '<div class="multiListText">'+elem.name+'</div>';
            nestableItem += '</div>';
          nestableItem += '</li>';

          multiListNestable.find('.dd-list').append(nestableItem);
          selector.find('option[data-multiList-id="'+elem.id+'"]').attr("data-order", key);
        });
        multiListNestable.find('.unselectNestable').on("click", function(e){
          var idUnelect = $(this).parent().attr('data-id');
          selector.find('option[data-multiList-id="'+idUnelect+'"]').attr("selected", false);
          $(this).parent().remove();
          e.stopPropagation();
        });
      }

      var multiListImages = "";
      if(settings.itemImage){
        multiListImages = "multiListImages"
      }
      var draggClass;

      if( settings.orientation === "V"){
        draggClass = multiListId+' multiListDragel '+multiListImages;
      }else{
        draggClass = multiListId+' multiListDragel '+multiListImages+' multiList'+settings.orientation
      }

      multiListNestable.nestable({
        dragClass: draggClass,
        maxDepth: 1,
        group: multiListId,
        callback: function(l,e){
        // l is the main container
        // e is the element that was moved
          var dataNestableOrder = multiListNestable.nestable('serialize');
          $.each( dataNestableOrder, function( key, elem ) {
            selector.find('option[data-multiList-id="'+elem.id+'"]').attr("data-order", key);
          });
        }
      });
    }
    /*
      Ejecuta Select2
    */
    that.execSelect2 = function( ){
      selector.select2({
        tags: "true",
        placeholder: settings.placeholder
      });
    }
    /*
      Reload MultiList
    */
    that.reloadMultiList = function( ){
      that.initOptionsValues();
      that.getSelectedValues();
      that.execNestable();
      that.reloadBinds();
    }
    /*
      Metedo con los binds genericos del MultiList
    */
    that.multiListBinds = function( ){

      selector.on("change", function (e) {
        that.reloadMultiList();
      });
      that.reloadBinds();

    }
    that.reloadBinds = function(){
      if(settings.itemActions){
        multiListNestable.find('.dd-multiListActions li').on("click", function (e) {
          var itemClicked = $(e.currentTarget).attr('data-action-id');
          $.each(settings.itemActions, function( i, act ) {
            if(itemClicked === act.id){
              act.action( that.getMultilistItem( $(e.currentTarget).closest('li.dd-item').attr('data-id')), selector );
            }
          });
        });
      }
    }
    /*
      Init
    */
    that.init = function(){

      if(typeof(multiListCount)!=="undefined"){
        multiListCount++;
      }else{
        multiListCount = 1;
      }

      multiListId = 'multiListId-'+multiListCount;

      that.initOptionsValues();
      that.getSelectedValues();
      that.createInterface();
      that.execSelect2();
      that.execNestable();
      that.multiListBinds();

    }
    that.init();
  };

  $.fn.multiMultiList = function( options ){
    $(this).each(function( index ) {
      $(this).multiList(options);
    });
  }
}( jQuery ));
